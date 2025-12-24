# Challenge 07 - Handling Dependent APIs with mergeMap (Users & Posts Dashboard)

## Challenge Overview

Build Users & Posts Dashboard that demonstrates handling **dependent API
calls** using **RxJS `mergeMap`**.\

---

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

```ts
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

---

## Step 2: Create API Services

### User Service

```ts
class UserService {
  getUsers() => HttpClient.get<{ users: User[] }>('https://dummyjson.com/users')
}
```

### Post Service

```ts
class PostService {
  getPostsByUser(userId: number) =>
    HttpClient.get<{ posts: Post[] }>(`https://dummyjson.com/posts/user/${userId}`)
}
```

---

## Step 3: Create Facade Service (Advanced)

Use `mergeMap` to handle dependent API calls. Manage filter state with a
**Signal**.

```ts
class UserPostFacadeService {
  private users$ = userService.getUsers().pipe(map((res) => res.users));

  filterStatus = signal<"all" | "withPosts" | "withoutPosts">("all");

  usersWithPosts$ = this.users$.pipe(
    mergeMap((users) =>
      forkJoin(
        users.map((user) =>
          postService.getPostsByUser(user.id).pipe(
            map((res) => ({
              ...user,
              postCount: res.posts.length,
            }))
          )
        )
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true }) // cache result
  );
}
```

---

## Step 4: Create Standalone Component

```ts
class UserPostsComponent {
  facade = inject(UserPostFacadeService);

  usersWithPosts$ = facade.usersWithPosts$;
}
```

---

# Understanding `mergeMap` with Dependent API Calls in Angular

## The Code

```ts
this.userService.getUsers().pipe(
  mergeMap((users) => {
    return forkJoin(
      users.map((user) =>
        this.postService.getPostsByUser(user.id).pipe(
          catchError(() => of([])),
          map((posts) => ({
            ...user,
            posts,
          }))
        )
      )
    );
  })
);
```

---

## Step-by-Step Explanation

### 1. Fetch all users

```ts
this.userService.getUsers();
```

- Calls the API: `https://dummyjson.com/users`
- Returns a list of users, for example:

```json
[
  { "id": 1, "firstName": "John" },
  { "id": 2, "firstName": "Jane" }
]
```

---

### 2. Use **mergeMap** to work with the users

```ts
mergeMap(users => { ... })
```

- `mergeMap` takes the result from the **first API call** (users).
- It lets us **start another Observable** (posts API) based on those users.
- In other words:
  > First, get all users → then for each user, fetch their posts.

---

### 3. Fetch posts for each user

```ts
this.postService.getPostsByUser(user.id);
```

- For John → `/posts?userId=1`
- For Jane → `/posts?userId=2`
- Each call is independent.

---

### 4. Handle errors safely

```ts
catchError(() => of([]));
```

- If posts API fails for a user, return an **empty array** (`[]`) instead of breaking the app.
- Why ? - If one api fails in forkJoin then rest all the APIs will npt be processed.

---

### 5. Attach posts to the user object

```ts
map((posts) => ({
  ...user,
  posts,
}));
```

- Adds a new property `posts` to each user.
- Example result:

```json
{
  "id": 1,
  "firstName": "John",
  "posts": [{ "id": 101, "title": "Hello" }]
}
```

---

### 6. Wait for all requests with **forkJoin**

```ts
forkJoin([...])
```

- Runs **all post requests at the same time**.
- Waits until **all of them finish**.
- Returns one array containing all users with their posts:

```json
[
  { "id": 1, "firstName": "John", "posts": [...] },
  { "id": 2, "firstName": "Jane", "posts": [...] }
]
```

---

## Why use `mergeMap` here?

- `mergeMap` is great for **dependent API calls**:
  - First call → get users.
  - Then, based on those users, trigger another set of calls (posts).
- It “flattens” the Observables, so you don’t end up with nested Observables (`Observable<Observable<...>>`).
- Perfect for: **“Take this result, then use it to call another API.”**

---

## Final Flow

1. **Get users** → a list.
2. **For each user** → fetch their posts.
3. **If error** → show empty posts.
4. **Combine all** → one final array with users + posts.
5. **Display in table** → User → Post Count → Post Titles.

---

**In short:**  
`mergeMap` helps us **chain API calls** in Angular.  
It makes it easy to fetch **users first**, then fetch **posts for each user**, and finally merge everything into one result.

---

## Key Angular Features Demonstrated

- **RxJS `mergeMap`** → chaining dependent APIs (users → posts).\
- **Signals API** → reactive filter state + computed filtering.\
- **Facade Pattern** → separation of API orchestration from
  component.\
- **Standalone Component & `inject()`** → modern Angular DI.\
- **New control flow (`@for`, `@if`)** → template-level filtering.

---

## Interview Tips

- Explain why `mergeMap` is used for **dependent API calls** (user →
  posts).
- Discuss the **trade-offs** (e.g., `switchMap` vs. `mergeMap`).
- Highlight **Signals**
- Emphasize the **Facade Pattern** as a clean architecture choice.
