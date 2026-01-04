"use client";
import Feed from "@/components/Feed";
import InputSearch from "@/components/form/InputSearch";
import UserCard from "@/components/UserCard";
import { getUsers } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const ExplorePage = () => {
  const [text, setText] = useState("");
  const [value] = useDebounce(text, 500);

  const { data: users } = useQuery({
    queryKey: [`users`, value],
    queryFn: async () => await getUsers(value, 5),
  });

  return (
    <div className="space-y-4">
      <div className="p-4">
        <InputSearch value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        {users?.map((user) => (
          <UserCard key={user.id} user={user} search={value} />
        ))}
      </div>
      <Feed q={value} />
    </div>
  );
};

export default ExplorePage;
