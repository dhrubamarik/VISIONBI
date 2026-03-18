import alasql from "alasql";

export const runQuery = (sql,data)=>{

try{

const result = alasql(sql,[data]);
return result;

}catch(err){

console.log("SQL Error:",err);
return [];

}

}