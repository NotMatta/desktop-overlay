import { useContext, createContext, useState, useEffect } from "react";
import { Calendar, ChartNoAxesColumn, ClipboardCheck, Clock, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const PathContext = createContext({
  path: "",
  setPath: (path: string) => {path}
});

export const PathProvider = ({ children }: { children: React.ReactNode }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    setPath(currentPath);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed');
        return;
      }
      if (event.altKey) {
        event.preventDefault();
        if( event.key == "&") {
          setPath("/dashboard");
        }
        if( event.key == "é") {
          setPath("/quests");
        }
        if( event.key == '"') {
          setPath("/settings");
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <PathContext.Provider value={{ path, setPath }}>
      {children}
    </PathContext.Provider>
  );
};


export const usePath = () => {
  const context = useContext(PathContext);
  if (!context) {
    throw new Error("usePath must be used within a PathProvider");
  }
  return context;
};

const Link = (props: {children: React.ReactNode, href: string}) => {
  const { path, setPath } = usePath();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPath(props.href);
  }

  return (
    <Button size="icon" onClick={handleClick} variant={path.includes(props.href) ? "default" : "outline"}>
      {props.children}
    </Button>
  )
}

export const NavBar = () => {
  return (
    <nav className="bg-primary-foreground/90 border p-2 rounded-lg flex gap-4">
    <Link href="/dashboard"><LayoutDashboard /></Link>
    <Link href="/time"><Clock /></Link>
    <Link href="/quests"><ClipboardCheck /></Link>
    <Link href="/calendar"><Calendar /></Link>
    <Link href="/stats"><ChartNoAxesColumn /></Link>
    <Link href="/settings"><Settings /></Link>
    </nav>
  );
}

export default PathProvider;
