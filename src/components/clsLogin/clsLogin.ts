/*
import PocketBase from 'pocketbase';

//const db = new PocketBase(database_url);

export async function loginUser({ db,user, password }) {
    try {
        const authData = await db.collection(pb_user_collection)
            .authWithPassword(user, password);
            return authData;
    } catch (error) {
        throw error;
    }
}

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pb_user = await loginUser({
        pb,
        user: user.identity,
        password: user.password,
      });
    //  add te authstore to a cookie for easy server side use
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      if (search_params) {
        //  redirect to the page tey were going to before
        router.push(search_params);
      } else {
        router.push("/");
      }
    // console.log("auth success = ",pb_user);
      return pb_user;
    } catch (error: any) {
      console.log("error logging in user === ", error.originalError);
      throw error;
    }
  };
*/