import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthError, getConversation } from "../api.js";
import { STATUS_LABELS, formatDate, visitorLabel } from "../format.js";
import { card, errorBox } from "../ui.js";
import RichText from "../components/RichText.jsx";

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState({ id: null, conversation: null, error: "" });
  const current = loaded.id === id;
  const conversation = current ? loaded.conversation : null;
  const error = current ? loaded.error : "";

  useEffect(() => {
    let cancelled = false;
    getConversation(id)
      .then((data) => !cancelled && setLoaded({ id, conversation: data, error: "" }))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AuthError) navigate("/login", { replace: true });
        else setLoaded({ id, conversation: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  // Back to the list as it was left (page, search), if we came from it
  const back = (e) => {
    if (window.history.state?.idx > 0) {
      e.preventDefault();
      navigate(-1);
    }
  };

  return (
    <section>
      <Link
        to="/conversations"
        onClick={back}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-hover hover:text-navy"
      >
        ← All conversations
      </Link>

      {error && (
        <p className={errorBox} role="alert">
          {error}
        </p>
      )}
      {!conversation && !error && <p className="text-muted">Loading…</p>}

      {conversation && (
        <>
          <h1 className="mb-5 text-2xl font-bold text-navy sm:text-3xl">Conversation</h1>

          <dl className={`${card} mb-8 grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3`}>
            <Meta label="Started">{formatDate(conversation.createdAt)}</Meta>
            <Meta label="Last message">{formatDate(conversation.updatedAt)}</Meta>
            <Meta label="Questions">{conversation.questionCount}</Meta>
            <Meta label="Conversation ID">
              <span className="font-mono text-xs font-medium break-all">{conversation.conversationId}</span>
            </Meta>
            <Meta label="Visitor">
              {conversation.visitorId ? (
                <Link
                  to={`/conversations?visitor=${conversation.visitorId}`}
                  className="text-brand hover:underline"
                  title={conversation.visitorId}
                >
                  {visitorLabel(conversation.visitorId)} · all their chats
                </Link>
              ) : (
                "—"
              )}
            </Meta>
            <Meta label="IP address">
              <span className="font-mono text-sm font-medium break-all">{conversation.ip || "—"}</span>
            </Meta>
          </dl>

          <ol className="flex flex-col gap-4">
            {conversation.messages.map((m, i) => (
              <Message key={i} message={m} />
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

function Meta({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-1 font-semibold text-navy">{children}</dd>
    </div>
  );
}

// Visitor on the right in the website's blue gradient, assistant on the left in white,
// like the chat widget itself.
function Message({ message: m }) {
  const visitor = m.role === "user";
  const status = STATUS_LABELS[m.status];

  return (
    <li className={`flex max-w-full flex-col gap-1.5 sm:max-w-[80%] ${visitor ? "items-end self-end" : "items-start self-start"}`}>
      <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
        <span className="font-semibold text-navy">{visitor ? "Visitor" : "AI assistant"}</span>
        <time className="text-muted">{formatDate(m.createdAt)}</time>
        {status && (
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${
              m.status === "failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"
            }`}
          >
            {status}
          </span>
        )}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed wrap-anywhere ${
          visitor
            ? "rounded-tr-md bg-linear-to-br from-brand to-brand-deep whitespace-pre-wrap text-white shadow-md shadow-brand/25"
            : "rounded-tl-md border border-sky-line bg-white text-navy shadow-sm shadow-navy/5"
        }`}
      >
        {!m.content ? (
          <em className="text-muted">(no answer)</em>
        ) : visitor ? (
          m.content
        ) : (
          <RichText text={m.content} />
        )}
      </div>
    </li>
  );
}
