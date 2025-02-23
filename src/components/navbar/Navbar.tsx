import LogOut from "../custom-buttons/LogOutButton"
import {CreateTaskModal} from "../modals/create-task-modal"

const Navbar = () => {
  return (
    <div className="bg-slate-800 flex p-3 justify-between items-center gap-4">
      <p className="text-slate-300 font-extrabold text-3xl">Task</p>
      <div className="flex items-center gap-3">
        <CreateTaskModal/>
        <LogOut/>
      </div>
      
    </div>
  )
}

export default Navbar