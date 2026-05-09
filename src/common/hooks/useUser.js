import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { supabase } from '@/lib/supabase';

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
        const { data } = await supabase
          .from('user_assignments')
          .select('program_id')
          .eq('user_id', firebaseUser.uid);

        setAssignedPrograms(data.map(row => row.program_id));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, role, assignedPrograms, loading };
}