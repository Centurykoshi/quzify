import { type User } from "better-auth";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { type AvatarProps } from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar = ({ user, ...props }: Props) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative w-10 h-10">
          <Image
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
            fill
            sizes="40px"
            className="object-cover rounded-lg"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;