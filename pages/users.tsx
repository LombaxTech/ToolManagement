import { users } from "@/data";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Users() {
  const router = useRouter();

  const { toolId } = router.query;

  const [userId, setUserId] = useState<any>("");
  const [error, setError] = useState<any>(false);
  const [success, setSuccess] = useState<any>(false);

  const [foundUser, setFoundUser] = useState<any>(null);

  const [logs, setLogs] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let q = query(collection(db, "logs"), orderBy("borrowDate", "asc"));

      onSnapshot(q, (snapshot) => {
        let logs: any = [];
        snapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
        setLogs(logs);
      });

      //   let snapshot = await getDocs(collection(db, "logs"));
      // let snapshot = await getDocs(q);
    };

    init();
  }, []);

  const [tools, setTools] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      onSnapshot(collection(db, "tools"), (snapshot) => {
        let tools: any = [];

        snapshot.forEach((doc) =>
          tools.push({
            docId: doc.id,
            ...doc.data(),
          })
        );
        setTools(tools);
      });

      // let snapshot = await getDocs(collection(db, "tools"));
    };

    init();
  }, []);

  const findUser = () => {
    setError(false);
    setFoundUser(null);

    let foundUser = users.find((u) => u.id == userId);
    if (!foundUser) {
      return setError("User does not exist");
    }

    setFoundUser(foundUser);
  };

  const borrowTool = async () => {
    setSuccess(false);
    setError(false);

    let tool = tools.find((t: any) => t.id == toolId);
    if (!tool.available) return setError("Tool is being borrowed");

    try {
      const newLog = {
        user: foundUser,
        borrowDate: new Date(),
        tool,
        status: "Unavailable",
      };

      await addDoc(collection(db, "logs"), newLog);

      // MAKE TOOL UNAVAILABLE
      await updateDoc(doc(db, "tools", tool.docId), { available: false });

      const successMessage = `${foundUser.name} (${foundUser.id}) borrowed the ${tool?.name} (${tool?.id})`;
      setSuccess(successMessage);
      setFoundUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const returnTool = async () => {
    setSuccess(false);
    setError(false);

    let tool = tools.find((t: any) => t?.id == toolId);

    let logToUpdate = logs.find(
      (log: any) => log.tool.id === tool.id && log.status === "Unavailable"
    );

    if (tool.available) return setError("Tool is not being borrowed");

    try {
      const updatedLog = {
        action: "return",
        status: "Available",
        returnDate: new Date(),
      };

      let logToUpdate = logs.find(
        (log: any) => log.tool.id === tool.id && log.status === "Unavailable"
      );

      let logDocRef = doc(db, "logs", logToUpdate.id);
      await updateDoc(logDocRef, updatedLog);

      // MAKE TOOL UNAVAILABLE
      await updateDoc(doc(db, "tools", tool.docId), { available: true });

      const successMessage = `${foundUser.name} (${foundUser.id}) returned the ${tool?.name} (${tool?.id})`;
      setSuccess(successMessage);
      setFoundUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (toolId)
    return (
      <div className="flex flex-col items-center pt-20">
        <div className="p-4 border flex flex-col gap-2">
          <input
            type="text"
            className="p-2 border"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Your ID"
          />
          <button className="btn btn-primary" onClick={findUser}>
            Find user
          </button>

          {foundUser && (
            <div className="flex gap-2">
              <button
                className="flex-1 btn btn-sm btn-outline"
                onClick={borrowTool}
              >
                Borrow
              </button>
              <button
                className="flex-1 btn btn-sm btn-secondary"
                onClick={returnTool}
              >
                Return
              </button>
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-200 text-red-700 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2 bg-green-200 text-green-700 text-center">
              {success}
            </div>
          )}
        </div>
      </div>
    );
}
