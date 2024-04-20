import { AuthContext } from "@/context/AuthContext";
import { users } from "@/data";
import { db } from "@/firebase";
import { timeEnd } from "console";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function AdminCreatePage() {
  return (
    <div className="flex justify-center gap-8 items-center pt-20">
      {/* CREATE TOOL */}
      <CreateTool />
      {/* CREATE USER */}
      <CreateUser />
    </div>
  );
}

const CreateTool = () => {
  const { user } = useContext(AuthContext);

  const [tools, setTools] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let tools: any = [];
      let snapshot = await getDocs(collection(db, "tools"));
      snapshot.forEach((doc) => tools.push({ docId: doc.id, ...doc.data() }));
      setTools(tools);
    };

    init();
  }, []);

  const [error, setError] = useState<any>(false);
  const [success, setSuccess] = useState<any>(false);

  const [toolId, setToolId] = useState("");
  const [toolName, setToolName] = useState("");
  const [timeLimit, setTimeLimit] = useState<any>(0);

  const createTool = async () => {
    try {
      const newTool = {
        id: toolId,
        name: toolName,
        timeLimit,
        available: true,
      };

      let newToolDoc = await addDoc(collection(db, "tools"), newTool);

      setToolId("");
      setToolName("");

      setTools((oldTools: any) => [
        ...oldTools,
        { docId: newToolDoc.id, ...newTool },
      ]);

      setSuccess("Created new tool");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tools.length === 0) return;

    const toolIdExists = tools.find((t: any) => t.id == toolId);
    const toolNameExists = tools.find((t: any) => t.name == toolName);

    if (toolIdExists) {
      setError("Tool Id already exists");
    } else if (toolNameExists) {
      setError("Tool Name already exists");
    } else {
      setError(false);
    }
  }, [tools, toolId, toolName]);

  if (!user)
    return (
      <div className="flex justify-center items-center pt-10">
        <h1 className="text-2xl font-bold">
          You must be signed in to view this page
        </h1>
      </div>
    );

  if (user && tools)
    return (
      <div className="p-4 border flex flex-col gap-2">
        <h1 className="text-xl font-medium">Create Tool</h1>
        <div className="flex flex-col gap-1">
          <label className="">Tool Id</label>
          <input
            type="text"
            className="p-2 border"
            value={toolId}
            onChange={(e) => setToolId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="">Tool Name</label>
          <input
            type="text"
            className="p-2 border"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="">Tool limit for usage (in hours)</label>
          <input
            type="number"
            className="p-2 border"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={createTool}
          disabled={error || !toolId || !toolName}
        >
          Create Tool
        </button>
        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
        {success && (
          <div className="p-2 bg-green-200 text-green-700 text-center">
            {success}
          </div>
        )}
      </div>
    );
};

const CreateUser = () => {
  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let users: any = [];
      let snapshot = await getDocs(collection(db, "users"));
      snapshot.forEach((doc) => users.push({ docId: doc.id, ...doc.data() }));
      setUsers(users);
    };

    init();
  }, []);

  const [error, setError] = useState<any>(false);
  const [success, setSuccess] = useState<any>(false);

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const createUser = async () => {
    try {
      const newUser = {
        id: userId,
        name: userName,
      };

      let newUserDoc = await addDoc(collection(db, "users"), newUser);

      setUserId("");
      setUserName("");

      setUsers((oldUsers: any) => [
        ...oldUsers,
        { docId: newUserDoc.id, ...newUser },
      ]);

      setSuccess("Created new user");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (users.length === 0) return;

    const userIdExists = users.find((u: any) => u.id == userId);
    const userNameExists = users.find((u: any) => u.name == userName);

    if (userIdExists) {
      setError("User Id already exists");
    } else if (userNameExists) {
      setError("User Name already exists");
    } else {
      setError(false);
    }
  }, [users, userId, userName]);

  if (users)
    return (
      <div className="p-4 border flex flex-col gap-2">
        <h1 className="text-xl font-medium">Create User</h1>
        <div className="flex flex-col gap-1">
          <label className="">User Id</label>
          <input
            type="text"
            className="p-2 border"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="">User Name</label>
          <input
            type="text"
            className="p-2 border"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={createUser}
          disabled={error || !userId || !userName}
        >
          Create User
        </button>
        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
        {success && (
          <div className="p-2 bg-green-200 text-green-700 text-center">
            {success}
          </div>
        )}
      </div>
    );
};
