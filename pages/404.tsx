import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter()

  return (
    <main className="web3-profile container grid-xl">
      <div className="empty error-404">
        <div className="empty-icon h1" style={{"fontSize": "72px"}}>🤔</div>
        <p className="empty-title h4">Not found</p>
        <p className="empty-subtitle">This page could not be found.</p>
        <button className="btn btn-primary mt-4" onClick={() => router.back()}>
          Go back
        </button>
      </div>
    </main>
  );
}
