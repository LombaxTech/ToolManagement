import { db } from "@/firebase";
import { formatDate } from "@/helperFunctions";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function AdminHome() {
  const [logs, setLogs] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let q = query(collection(db, "logs"), orderBy("date", "asc"));

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

  return (
    <div className="p-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">LIVE LOGS</h1>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Tool (id)</th>
            <th>Borrow Time</th>
            <th>Return Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs &&
            logs.map((log: any) => {
              const isBorrow = log.action == "borrow";
              const isAvailable = log.status === "Available";

              return (
                <tr key={log.id}>
                  <td>{log.user.name}</td>
                  <td>
                    {log.tool.name} ({log.tool.id})
                  </td>

                  <td>{isBorrow ? formatDate(log.date.toDate()) : ""}</td>
                  <td>{isBorrow ? "" : formatDate(log.date.toDate())}</td>
                  <td
                    className={`${
                      isAvailable ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {/* {log.action === "borrow" ? "Not available" : "Available"} */}

                    {isAvailable ? "Available" : "Not Available"}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
