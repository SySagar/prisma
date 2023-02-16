import { PrismaClient } from '@prisma/client'
//const prisma = new PrismaClient({log: ["query"]})
const prisma = new PrismaClient()

//log["query"] - this basically prints the sql kind prisma commands 

// prisma.user.findFirst

async function main() {
    
//const user = await prisma.user.create({data:{name: "Sally"}})

//This below line is for cleaning database for understanding purposes only
 await prisma.user.deleteMany()

const user = await prisma.user.create(
    {
        data: {
            name : "Kyle",
            email: "Kyle@test.com",
            age: 27,
            userPreference:{
                create:{
                    emailUpdates:true
                }
            }
        },
        //use include or select one at a time
        // include:{
        //     userPreference:true
        // },
        select:{
            name:true,
            userPreference:{select: {id:true}}
        }
    }
)
console.log(user)


//lets find something with unique keys
const uniUsers = await prisma.user.findUnique({
    where:{
    //email: "kyle@test.com",
    age_name:{
        age:27,
        name: "Kyle"
    }
    }
})


//lets find first with unique keys
const fUsers = await prisma.user.findFirst({
    where:{
    email: "kyle@test.com",
    name: "Kyle"
    }
})

/*take-n : It is used to display no of data with same field only two elemets 
  skip: It is used to skip first elemts in a group of elemts with one same field

  */

  //some more properties
const mUsers = await prisma.user.findMany({
    where:{
    email: "kyle@test.com",
    name: "Kyle"
    },
    orderBy: {
        age: "asc"  //or dsc
    },
    take:2,
    skip:1
})

  //relation queries or filtering
  const rUsers = await prisma.user.findMany({
    // where:{
    //     userPreference:{
    //         emailUpdates:true,
    //     }
    //  }
    where:{
        writtenposts:{
            every:{
                title: "Test"
            }

            //has the user wirtten no post that has this title
            // none:{
            //     title: "Test"
            // }

            //do any of the titlet has this title
            // some:{
            //     title: "Test"
            // }
        }
     }
})


//this is a new thing!! only user is changed ot post i.e. query on user now i guess
const tUsers = await prisma.post.findMany({
    where:{
        author: {
            is:{
                age:27
            },
            isNot:{
                age: 32
            }
        }
    }
})


//lets do some update
const updateUsers = await prisma.user.update({
    where:{
        email: "Kyle@test.com"
    },
    data:{
        email: "naru@tst.com"
    }
    
})

//updateMnay updates all where it matches the queries

//lets do some update
const updateUsers2 = await prisma.user.updateMany({
    where:{
        email: "Kyle@test.com"
    },
    data:{
        age:{
            increment : 1 // decrement , multiply , divide
        }
    }
    
})

//lets do some update
const dUser = await prisma.user.deleteMany({
    where:{
        age: {gt: 20}
    }
    
})


}

main()
    .catch(e=>{
        console.log(e.message)
    })
    .finally(async()=>{
        await prisma.$disconnect()
    })