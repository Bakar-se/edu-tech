import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
};

const Header = (props: Props) => {
  return (
    <Card className="w-full flex rounded-lg items-start p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/list/conversations" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="h-10 w-10 flex justify-center items-center">
          <AvatarImage src={props.imageUrl} />
          <AvatarFallback className="pb-1">
            {props.name.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{props.name}</h2>
      </div>
    </Card>
  );
};

export default Header;
