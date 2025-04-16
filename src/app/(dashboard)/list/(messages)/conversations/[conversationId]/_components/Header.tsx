import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};
const Header = (props: Props) => {
  return (
    <Card className="w-full flex flex-row rounded-lg items-center p-2 justify-between">
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
      <div className="flex gap-2">
        {props?.options ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button asChild size="icon" variant="secondary"><Settings /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {props?.options.map((option, id) => (
                <DropdownMenuItem
                  key={id}
                  onClick={option.onClick}
                  className={cn("font-semibold", {
                    "text-destructive": option.destructive,
                  })}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}


            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
