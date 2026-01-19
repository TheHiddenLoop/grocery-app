import { redirect } from "next/navigation";

function Page() {
  const user = true; 

  if (!user) {
    redirect("/login"); 
  }else{
    redirect("/home")
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
