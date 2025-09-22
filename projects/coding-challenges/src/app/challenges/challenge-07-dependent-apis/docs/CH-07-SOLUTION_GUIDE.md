# Challenge 07 - Handling Dependent APIs with mergeMap (Users & Posts Dashboard)

## Challenge Overview

Build Users & Posts Dashboard that demonstrates handling **dependent API
calls** using **RxJS `mergeMap`**.\
 
------------------------------------------------------------------------
## Approach:
0. Define Models for User, Posts

1. Fetch the list of **users** from the DummyJSON API:  
   - Endpoint: `https://dummyjson.com/users`

2. Fetch the list of **posts** from the DummyJSON API:  
   - Endpoint: `https://dummyjson.com/posts`

3. For each user, determine which posts belong to them using **`mergeMap`** to handle dependent API calls efficiently.

4. Display the combined data in a simple HTML table, showing:  
   - **User → Post Title(s)**  


---

## Step 1: Define Models

``` ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface UserWithPostCount extends User {
  postCount: number;
}
```

------------------------------------------------------------------------

## Step 2: Create API Services

### User Service

``` ts
class UserService {
  getUsers() => HttpClient.get<{ users: User[] }>('https://dummyjson.com/users')
}
```

### Post Service

``` ts
class PostService {
  getPostsByUser(userId: number) => 
    HttpClient.get<{ posts: Post[] }>(`https://dummyjson.com/posts/user/${userId}`)
}
```

------------------------------------------------------------------------

## Step 3: Create Facade Service

Use `mergeMap` to handle dependent API calls. Manage filter state with a
**Signal**.

``` ts
class UserPostFacadeService {
  private users$ = userService.getUsers().pipe(map(res => res.users))

  filterStatus = signal<'all'|'withPosts'|'withoutPosts'>('all')

  usersWithPosts$ = this.users$.pipe(
    mergeMap(users =>
      forkJoin(
        users.map(user =>
          postService.getPostsByUser(user.id).pipe(
            map(res => ({
              ...user,
              postCount: res.posts.length
            }))
          )
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true }) // cache result
  )
}
```

------------------------------------------------------------------------

## Step 4: Create Standalone Component

``` ts
class UserPostsComponent {
  facade = inject(UserPostFacadeService)

  usersWithPosts$ = facade.usersWithPosts$
  filterStatus = facade.filterStatus

   

  
}
```

------------------------------------------------------------------------
 

## Key Angular Features Demonstrated

-   **RxJS `mergeMap`** → chaining dependent APIs (users → posts).\
-   **Signals API** → reactive filter state + computed filtering.\
-   **Facade Pattern** → separation of API orchestration from
    component.\
-   **Standalone Component & `inject()`** → modern Angular DI.\
-   **New control flow (`@for`, `@if`)** → template-level filtering.

------------------------------------------------------------------------

## Interview Tips

-   Explain why `mergeMap` is used for **dependent API calls** (user →
    posts).
-   Discuss the **trade-offs** (e.g., `switchMap` vs. `mergeMap`).
-   Highlight **Signals** 
-   Emphasize the **Facade Pattern** as a clean architecture choice.
