import { db } from "@/firebase";
import { checkIfOverdue } from "@/helperFunctions";
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
import { useEffect, useState } from "react";

export default function Users() {
  const router = useRouter();

  const { toolId } = router.query;

  const [userId, setUserId] = useState<any>("");
  const [error, setError] = useState<any>(false);
  const [success, setSuccess] = useState<any>(false);

  const [foundUser, setFoundUser] = useState<any>(null);

  const [logs, setLogs] = useState<any>([]);

  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      let users: any = [];
      let snapshot = await getDocs(collection(db, "users"));
      snapshot.forEach((doc) => users.push({ ...doc.data() }));
      users.sort(function (a: any, b: any) {
        return a.id - b.id;
      });
      setUsers(users);
    };
    init();
  }, []);

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

    let foundUser = users.find((u: any) => u.id == userId);
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

  if (toolId) {
    // GET LOGS FOR FOUND USER
    let notReturnedUserLogs: any = [];
    let returnedLogs: any = [];

    if (foundUser && logs.length > 0) {
      logs.forEach((log: any) => {
        if (
          log.user.id == foundUser.id &&
          !log.returnDate &&
          log.status == "Unavailable"
        ) {
          notReturnedUserLogs.push(log);
        }

        if (
          log.user.id == foundUser.id &&
          log.returnDate &&
          log.status == "Available"
        ) {
          returnedLogs.push(log);
        }
      });
    }

    if (users)
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

            {foundUser && (
              <div className="flex flex-col gap-2 mt-4">
                <h1 className="text-lg">Borrow History</h1>

                {/* NOT RETURNED LOGS */}
                <div className="flex flex-col gap-1">
                  <span className="underline">Still not returned</span>

                  {notReturnedUserLogs &&
                    notReturnedUserLogs.map((log: any) => {
                      // CHECK IF RETURN IS OVERDUE

                      let startDate = log.borrowDate.toDate();
                      let toolTimeLimit = log.tool.timeLimit || 5;
                      let isOverdue = checkIfOverdue(startDate, toolTimeLimit);

                      return (
                        <div className="flex flex-col gap-1" key={log.id}>
                          <span className="">
                            You have borrowed tool id {log.tool.id}
                          </span>
                          {isOverdue && (
                            <span className="bg-red-200 text-red-600">
                              This is overdue
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* RETURNED LOGS */}
                <div className="flex flex-col gap-1">
                  <span className="underline">Returned</span>

                  {returnedLogs &&
                    returnedLogs.map((log: any) => {
                      return (
                        <span className="" key={log.id}>
                          You have borrowed tool id {log.tool.id}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
  }
}
