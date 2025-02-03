import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <>

     <div className="flex justify-center items-center h-[100vh] gap-5">

<Button
  variant="link"
  className="px-0"
  onClick={() => navigate('/home')}
>
  Home
</Button>

<Button
  variant="link"
  className="px-0"
  onClick={() => navigate('/')}
>
  Logout
</Button>

</div>
    </>
  )
}

export default Dashboard