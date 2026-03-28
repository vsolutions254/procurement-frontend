type ProjectsState = {
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  project: Project | null;
  projectLoading: boolean;
  projectError: string | null;
};
