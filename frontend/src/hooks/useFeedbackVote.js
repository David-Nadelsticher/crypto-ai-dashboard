import { useEffect, useState } from "react";
import { submitVote } from "../api/votes";

export default function useFeedbackVote({ sectionName, itemReference, contentSnapshot = null }) {
  const [selectedVote, setSelectedVote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    setSelectedVote(null);
    setMessage(null);
    setMessageType(null);
  }, [itemReference]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleVote(voteValue) {
    if (submitting || !itemReference || !contentSnapshot) return;

    const previousVote = selectedVote;
    setSelectedVote(voteValue);
    setSubmitting(true);
    setMessage(null);

    try {
      await submitVote({
        section: sectionName,
        item_reference: itemReference,
        vote_value: voteValue,
        content_snapshot: contentSnapshot,
      });
      setMessage("Piggy will use this feedback in future briefs.");
      setMessageType("success");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Failed to submit vote for ${sectionName}:`, error);
      }
      setSelectedVote(previousVote);
      setMessage("Could not save feedback. Try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting || !itemReference || !contentSnapshot;

  return {
    selectedVote,
    submitting,
    message,
    messageType,
    isDisabled,
    handleVote,
  };
}
