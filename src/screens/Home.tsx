import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

// const API_URL = 'https://selfish-irita-hasanraza38-9f48365c.koyeb.app/api/v1


const Home = () => {  
  const navigate = useNavigate()
    return (
    <>
      <div className="flex justify-center items-center h-[100vh] gap-5">

        <Button
          variant="link"
          className="px-0"
          onClick={() => navigate('/dashboard')}
        >
          Dasboard
        </Button>

        <Button
          variant="link"
          className="px-0"
          onClick={() => navigate('/register')}
        >
          Register
        </Button>

        <Button
          variant="link"
          className="px-0"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </div>
    </>
  )
}

export default Home