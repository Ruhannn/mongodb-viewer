// "use client";

// import { executeMongoCommand } from "@/actions/executeMongoCommand";
// import { useState } from "react";

// export default function MongoShell() {
//   const [code, setCode] = useState("db.collection('users').find({}).toArray()");
//   const [output, setOutput] = useState<any>(null);

//   async function run() {
//     const res = await executeMongoCommand(code);
//     setOutput(res);
//   }

//   return (
//     <div className="p-4 space-y-4">
//       <textarea
//         className="w-full h-48 font-mono p-2 border rounded"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//       />
//       <button
//         onClick={run}
//         className="px-4 py-2 bg-blue-600 text-white rounded"
//       >
//         Run
//       </button>
//       <pre className="bg-gray-100 p-2 rounded">
//         {JSON.stringify(output, null, 2)}
//       </pre>
//     </div>
//   );
// }

export default function page() {
  return (
    <div>page</div>
  );
}
