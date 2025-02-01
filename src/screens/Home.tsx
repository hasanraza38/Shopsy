import { Button } from "@/components/ui/button"

const Home = () => {

function click (){
    console.log("button clicked");
    
}



    
  return (

    <>
    <div className="flex justify-center items-center h-[100vh] gap-5">
        <h1>Home</h1>
        <Button variant="outline" onClick={click}>Click</Button>
    </div>
    </>
    
  )
}

export default Home