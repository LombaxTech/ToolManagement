import { db } from "@/firebase";
import {
  calculateDeadline,
  calculateRemainingTime,
  calculateTimeSpent,
  formatDate,
} from "@/helperFunctions";
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
            <th>Remaining</th>
            <th>Spent Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs &&
            logs.map((log: any) => {
              const isAvailable = log.status === "Available";

              const isReturned = isAvailable && log.returnDate;

              // GET REMAINING TIME
              let startDate = log.borrowDate.toDate();
              let toolTimeLimit = log.tool.timeLimit || 5;
              let deadline = calculateDeadline(startDate, toolTimeLimit);
              let timeSpent = calculateTimeSpent(startDate);
              let remainingTime = calculateRemainingTime(
                startDate,
                toolTimeLimit
              );

              return (
                <tr key={log.id}>
                  <td>{log.user.name}</td>
                  <td>
                    {log.tool.name} ({log.tool.id})
                  </td>

                  <td>{formatDate(log.borrowDate.toDate())}</td>
                  <td>
                    {isReturned ? formatDate(log.returnDate.toDate()) : ""}
                  </td>
                  {/* REMAINING TIME  -- hours left of limit */}
                  <td>
                    {remainingTime} hours left of {toolTimeLimit} hours
                  </td>
                  {/* SPENT TIME */}
                  <td>{timeSpent} hours </td>
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
