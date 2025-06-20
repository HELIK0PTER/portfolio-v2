"use client";

import { useRef } from "react";

export function DeleteProjectButton({ action, children }: { action: (formData: FormData) => void, children: React.ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={e => {
        if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
} 