import { db } from "@/firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function UsersAndTools() {
  const [users, setUsers] = useState<any>([]);
  const [tools, setTools] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let users: any = [];
      let snapshot = await getDocs(collection(db, "users"));
      snapshot.forEach((doc) => users.push({ ...doc.data() }));
      users.sort(function (a: any, b: any) {
        return a.id - b.id;
      });
      setUsers(users);

      let tools: any = [];
      snapshot = await getDocs(collection(db, "tools"));
      snapshot.forEach((doc) => tools.push({ ...doc.data() }));
      tools.sort(function (a: any, b: any) {
        return a.id - b.id;
      });
      setTools(tools);
    };

    init();
  }, []);

  return (
    <div className="p-4 flex flex-col lg:flex-row w-full lg:gap-0 gap-8">
      {/* USERS */}
      <div className="flex flex-col gap-4 w-1/2">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex flex-col gap-2">
          {users &&
            users.map((user: any, i: number) => {
              return (
                <div className="flex items-center gap-4">
                  {/* ID */}
                  <span className="lg:w-1/12 w-3/12">{user.id}</span>
                  {/* NAME */}
                  <span className="w-1/12">{user.name}</span>
                </div>
              );
            })}
        </div>
      </div>
      {/* TOOLS  */}
      <div className="flex flex-col gap-4 w-1/2">
        <h1 className="text-2xl font-bold">Tools</h1>
        <div className="flex flex-col gap-2">
          {tools &&
            tools.map((tool: any, i: number) => {
              return (
                <div className="flex items-center gap-4">
                  {/* ID */}
                  <span className="w-1/12">{tool.id}</span>
                  {/* NAME */}
                  <span className="w-1/12">{tool.name}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
