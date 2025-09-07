'use client';

import MultiStepAppIdeaForm from '@/components/MultiStepAppIdeaForm';
import HeaderAuthenticated from '@/components/HeaderAuthenticated';

export default function NewIdeaPage() {
  return (
    <>
      <HeaderAuthenticated />
      <MultiStepAppIdeaForm />
    </>
  );
}