import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function useUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [assignedPrograms, setAssignedPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setAssignedPrograms([]);
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdTokenResult();
      const userRole = token.claims.role;

      setUser(firebaseUser);
      setRole(userRole);

      if (userRole === 'supervisor') {
        const idToken = await firebaseUser.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me/assignments`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        setAssignedPrograms(data.programIds || []);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, assignedPrograms, loading };
}