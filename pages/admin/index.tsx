import { db } from "@/firebase";
import {
  calculateDeadline,
  calculateRemainingTime,
  calculateTimeSpent,
  formatDate,
  isToday,
  isYesterday,
} from "@/helperFunctions";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

const dateValues = ["Today", "Yesterday", "All Time"];

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

  const [selectedDate, setSelectedDate] = useState(dateValues[0]);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-2xl font-bold">LIVE LOGS</h1>

        {/* FILTER */}
        <div className="">
          <select
            className="border p-2 border-black"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateValues.map((date) => {
              return <option key={date}>{date}</option>;
            })}
          </select>
        </div>
      </div>

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

              // IF SELECTED DATE IS TODAY && LOG DATE IS NOT TODAY RETURN NULL
              if (selectedDate === "Today" && !isToday(startDate)) return null;
              // IF SELECTED DATE IS YESTERDAY && LOG DATE IS NOT YESTERDAY RETURN NULL
              if (selectedDate === "Yesterday" && !isYesterday(startDate))
                return null;
              // IF SELECTED DATE IS ALL TIME && THEN ALLOW

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
