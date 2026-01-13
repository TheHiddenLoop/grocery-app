import { redirect } from "next/navigation";

function Page() {
  const user = false; 

  if (!user) {
    redirect("/login"); 
  }

  return (
    <div>
      <h1 className="text-center text-3xl text-gray-700 bg-green-100 min-h-screen">
        Hii There
      </h1>
    </div>
  );
}

export default Page;
