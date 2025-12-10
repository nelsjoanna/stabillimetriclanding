import Header from "../landing/Header";

export default function HeaderExample() {
  return (
    <Header onJoinWaitlist={() => console.log("Join waitlist clicked")} />
  );
}
