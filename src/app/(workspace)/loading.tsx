import { Loader } from "lucide-react"


const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Loader className="animate-spin text-indigo-400" size={40}/>
    </div>
  )
}

export default Loading