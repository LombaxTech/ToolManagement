import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import { tools } from "@/data";

export default function Tools() {
  const router = useRouter();

  const [tools, setTools] = useState<any>([]);

  useEffect(() => {
    const fetchTools = async () => {
      let tools: any = [];
      let snapshot = await getDocs(collection(db, "tools"));
      snapshot.forEach((doc) => tools.push({ ...doc.data() }));
      setTools(tools);
    };

    fetchTools();
  }, []);

  const [toolId, setToolId] = useState<any>("");

  const [error, setError] = useState<any>(false);

  const checkTag = async () => {
    setError(false);

    let tool = tools.find((tool: any) => tool.id == toolId);
    if (!tool) {
      return setError("Tool Id does not exist");
    }

    router.push(`/users?toolId=${toolId}`);
    console.log(toolId);
  };

  if (tools)
    return (
      <div className="flex flex-col items-center pt-20">
        <div className="p-4 border flex flex-col gap-2">
          <h1 className="text-2xl font-medium">Input Tool Id</h1>
          <input
            type="text"
            className="p-2 border"
            value={toolId}
            onChange={(e) => setToolId(e.target.value)}
            placeholder=""
          />
          <button className="btn btn-primary" onClick={checkTag}>
            Check tag
          </button>
          {error && (
            <div className="p-2 bg-red-200 text-red-700 text-center">
              Invalid Tool Id
            </div>
          )}
        </div>
      </div>
    );
}
