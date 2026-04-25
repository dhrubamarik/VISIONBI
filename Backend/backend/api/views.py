import os
from rest_framework.response import Response
from .services.llm_service import generate_query
from django.conf import settings
from .services.query_engine import run_query, get_columns
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
from .models import UploadedFile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

# Create your views here.

# This view handles the main logic of receiving a prompt, generating SQL and chart type, running the query, and returning results.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask(request):
    user = request.user
    
    # Step 1 - get prompt from request
    # BEFORE: prompt was never fetched! ❌
    # NOW: we get it from request.data ✅
    prompt = request.data.get("prompt")
    file_id = request.data.get("file_id")
    
    # Step 2 - validate inputs
    if not prompt:
        return Response({"error": "No prompt provided"}, status=400)
    
    if not file_id:
        return Response({"error": "No file selected"}, status=400)

    # Step 3 - get the file from database
    try:
        file_obj = UploadedFile.objects.get(id=file_id, user=user)
    except UploadedFile.DoesNotExist:
        return Response({"error": "File not found"}, status=404)

    # Step 4 - get real file path
    # file_obj.file.path gives us full path like:
    # /Users/you/project/media/user_files/sales.csv
    file_path = file_obj.file.path

    # Step 5 - get columns from CSV
    # Pass file_path directly - NOT filename
    columns = get_columns(file_path)
    
    # Step 6 - ask Groq to generate query
    llm_output = generate_query(prompt, columns)
    
    # Step 7 - check if LLM returned error
    if "error" in llm_output:
        return Response({"error": llm_output["error"]}, status=500)

    # Step 8 - run the pandas query
    # Pass file_path directly - NOT filename  
    data = run_query(llm_output["sql"], file_path)

    # Step 9 - return chart type and data
    return Response({
        "chart": llm_output["chart"],
        "data": data
    })
# This is a new view to handle CSV uploads
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def upload_csv(request):
    user = request.user
    file = request.FILES.get('file')

    if not file:
        return Response(
            {"error": "No file uploaded"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check if user already has file with same name
    # WHY: Prevent duplicate files piling up
    original_name = file.name
    existing = UploadedFile.objects.filter(
        user=user,
        file__endswith=original_name  
    ).first()

    if existing:
        # Delete old physical file from disk
        if os.path.exists(existing.file.path):
            os.remove(existing.file.path)
        # Delete database record
        existing.delete()

    # Now save new file cleanly
    uploaded = UploadedFile.objects.create(user=user, file=file)

    return Response({
        "message": "File uploaded successfully",
        "file_id": uploaded.id,
        "filename": uploaded.file.name.split("/")[-1]
    }, status=status.HTTP_200_OK)

#SIGN_UP
@api_view(['POST'])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Check 1 - are fields empty?
    if not username or not password:
        return Response(
            {"error": "Username and password required"}, 
            status=400
        )

    # Check 2 - does username already exist?
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already taken"}, 
            status=400
        )

    # All good - create the user
    user = User.objects.create_user(
        username=username, 
        password=password
    )

    return Response(
        {"message": "User created successfully"}, 
        status=201
    )
#LOGIN
@api_view(['POST'])
def login_view(request):
    user = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password")
    )

    if user:
        login(request, user)
        return Response({"message": "Logged in"})
    return Response({"error": "Invalid credentials"})
# Add this new view to views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_files(request):
    files = UploadedFile.objects.filter(
        user=request.user
    ).order_by('-uploaded_at')

    file_list = []

    for f in files:
        # Check if physical file actually exists on disk
        # WHY: User might delete file manually from folder
        # Database record stays but file is gone
        if os.path.exists(f.file.path):
            file_list.append({
                "id": f.id,
                "filename": f.file.name.split("/")[-1],
                "uploaded_at": f.uploaded_at.strftime("%d %b %Y, %H:%M")
            })
        else:
            # File missing from disk - clean up DB record too
            print(f"Ghost file found, removing DB record: {f.file.name}")
            f.delete()

    return Response({"files": file_list})