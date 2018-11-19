import React from "react";
import Link from "next/link";

const ChallengeTeaser = ({ challenge }) => (
  <Link href={`/challenge?id=${challenge.id}`}>
    <a>
      <h3>{challenge.title}</h3>
      <h4>{challenge.user.name} vs {challenge.participant.name}</h4>
    </a>
  </Link>
);

export default ChallengeTeaser;
