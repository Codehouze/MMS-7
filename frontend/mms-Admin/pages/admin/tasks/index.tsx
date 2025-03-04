import { Button } from "@/components";
import { Card } from "@/components/Card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { ReactElement } from "react";
import { Calendar, Filter, Search } from "react-feather";

const Tasks = () => {
  const router = useRouter()
  return (
    <div>
      <div className="mb-[0.75rem] flex justify-between ">
        <div className="flex justify-between items-center w-[310px]">
          <h1 className="text-2xl font-semibold text-mmsBlack1">Tasks</h1>
          <div className="flex items-center gap-3">
            <Button className="text-mmsPry3">
              <Search size={20} />
            </Button>
            <Button className="text-mmsPry3">
              <Filter size={20} />
            </Button>
          </div>
        </div>
        <div>
          <Button variant="primary" className="py-[10px] px-[40px]" onClick={() => router.push('/admin/tasks/create_task')}>
            Create Task
          </Button>
        </div>
      </div>
      <div className="flex items-start ">
        {/* tasks sidebar */}
        <div className="w-[310px] min-h-screen">
          <Card className="py-4 shadow-none w-[309px] border flex-row gap-3 items-start justify-center border-[#E6E6E6] rounded-md">
            <Image 
            src="/images/task.png"
            width={39}
            height={40}
            alt="task"
            />
            <div className="text-[#141414] font-semibold ">
              <h5>Room Library article write...</h5>
              <span className="flex items-center">
                <Calendar size={16} className="text-mmsPry3"/>
                <span className="text-mmsBlack5 text-xs">3 days from now</span>
              </span>
            </div>
          </Card>
        </div>
        {/* task details */}
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Tasks;

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
