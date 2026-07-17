import { useEffect } from "react";

export function SEO({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | NeuroDesk AI`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [title, description]);

  return null;
}
