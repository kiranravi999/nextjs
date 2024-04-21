import { useState, useEffect } from 'react';
import { useNavigation } from 'next/navigation';
import { useClient } from 'next/client';
import SavedInterests from '../SavedInterests/page';


const UserInterests = () => {
  const categoryData = [];
  for (let i = 1; i <= 100; i++) {
    categoryData.push({
      id: i,
      category: `Category ${i}`,
      ischecked: false,
    });
  }




  
  const [a, setA] = useState(categoryData);
  const [count, setCount] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const router = useNavigation();
  const { client } = useClient(); 
  const { PrismaClient } = require('@prisma/client');
  
  const prisma = new PrismaClient();

  useEffect(async() => {
    let signedUser = JSON.parse(localStorage.getItem("loginUser"));
    let loginusersList = await prisma.user.findMany();

    if (loginusersList.length > 0) {
      let userInterests = [];
      loginusersList.forEach((item) => {
        if (item.id === signedUser) {
          userInterests = item.customData;
          setA(userInterests);
        }
      });
    }
  }, []);

  
  const Changed = (item) => {
    setA(
      a.map((each) => {
        if (each.id == item.id) {
          return { ...each, ischecked: !each.ischecked };
        } else {
          return each;
        }
      })
    );
  };

  const saved = async() => {
    await prisma.user.update({
        where: { id: signedUser },
        data: {
          customData: JSON.stringify(a) // Convert object to JSON string before storing
        }
      });

   setRedirect(true)
  };


  if (redirect) {
   return router.push('/signin');
  }

  const increaseCount = () => {
    if (count < 17) {
      setCount(count + 1);
    }
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const slicedData = () => {
    return a.slice(count*6-6,count*6)
  };

  return (
    <div>
    <Header/>
    <div className="con m-0 p-0 d-flex flex-column justify-content-center align-items-center mt-3">
      <form className=" form-con p-4  mt-2 d-flex flex-column">
        <h4 className="text-center">Please mark your interests!</h4>
        <p className="text-center">We will keep you notified.</p>
        <p>My saved interests!</p>

        {slicedData().map((item) => (
          <SavedInterests key={item.id} item={item} Changed={Changed} />
        ))}

        <div className="d-flex justify-content-center">
          <p onClick={decreaseCount}>&lt;</p>
          <p className="mx-4 ">{count}</p>
          <p onClick={increaseCount}>&gt;</p>
        </div>
        <button className="btn mt-2 btn-dark" type="submit" onClick={saved}>
          Save
        </button>
      </form>
    </div>
    </div>
  );
};

export default UserInterests;




