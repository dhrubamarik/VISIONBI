import { AiOutlineSend } from "react-icons/ai";
import { useState } from "react";

const QueryInput = ({ handleQuery }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = async () => {
        if (!query) return;

        const file_id = localStorage.getItem("file_id");

        if (!file_id) {
            alert("Please upload a CSV file first using the New button");
            return;
        }

        handleQuery(query, file_id);
        setQuery("");
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="search-wrapper d-flex flex-column align-items-center gap-3 w-100">

                <div className="d-flex align-items-center w-100 position-relative">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Ask a question about your data..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmit();
                        }}
                    />
                    <button className="search-btn" onClick={handleSubmit}>
                        <AiOutlineSend />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QueryInput;