---
title: C语言算法竞赛常用算法
published: 2026-05-28
pinned: false
draft: false
category: C/C++
tags: [C, 算法设计, 竞赛]
description: C语言算法竞赛常用算法：例题 + 完整代码
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/AcgExample/4.webp"
---

## 1. 并查集 —— 连通块问题


**例题**：洛谷 P3367 【模板】并查集  
**描述**：初始有 n 个元素，m 个操作。操作 `1 x y` 合并 x,y 所在集合；操作 `2 x y` 查询 x,y 是否在同一集合。

```c
#include <stdio.h>
#define MAXN 10005

int parent[MAXN], rank[MAXN];

void init(int n) {
    for (int i = 1; i <= n; i++) {
        parent[i] = i;
        rank[i] = 0;
    }
}

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

void unionSet(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return;
    if (rank[rx] < rank[ry])
        parent[rx] = ry;
    else if (rank[rx] > rank[ry])
        parent[ry] = rx;
    else {
        parent[ry] = rx;
        rank[rx]++;
    }
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    init(n);
    while (m--) {
        int op, x, y;
        scanf("%d%d%d", &op, &x, &y);
        if (op == 1) {
            unionSet(x, y);
        } else {
            printf("%c\n", find(x) == find(y) ? 'Y' : 'N');
        }
    }
    return 0;
}
```

<img src="../../../src/assets/images/2.jpg" alt="" >

---

## 2. 堆（优先队列）—— 合并果子

**例题**：洛谷 P1090 合并果子  
**描述**：n 堆果子，每次合并两堆，代价为重量和，求最小总代价。

```c
#include <stdio.h>
#include <stdlib.h>
#define MAXN 10005

int heap[MAXN], size = 0;

void push(int x) {
    int i = ++size;
    while (i > 1 && heap[i/2] > x) {
        heap[i] = heap[i/2];
        i /= 2;
    }
    heap[i] = x;
}

int pop() {
    int ret = heap[1];
    int last = heap[size--];
    int i = 1, child;
    while (i*2 <= size) {
        child = i*2;
        if (child+1 <= size && heap[child+1] < heap[child])
            child++;
        if (last <= heap[child]) break;
        heap[i] = heap[child];
        i = child;
    }
    heap[i] = last;
    return ret;
}

int main() {
    int n, x, a, b, ans = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        push(x);
    }
    while (size > 1) {
        a = pop();
        b = pop();
        ans += a + b;
        push(a + b);
    }
    printf("%d\n", ans);
    return 0;
}
```

<img src="../../../src/assets/images/3.png" alt="" >

---

## 3. 线段树 —— 区间加、区间求和

**例题**：洛谷 P3372 【模板】线段树 1  
**描述**：维护长度为 n 的序列，m 次操作：`1 x y k` 将 [x,y] 每个数加 k；`2 x y` 输出区间和。

```c
#include <stdio.h>
#define MAXN 100005
#define ll long long

ll tree[4*MAXN], lazy[4*MAXN];
int a[MAXN];

void pushUp(int rt) {
    tree[rt] = tree[rt<<1] + tree[rt<<1|1];
}

void pushDown(int rt, int l, int r) {
    if (lazy[rt]) {
        int mid = (l+r)>>1;
        lazy[rt<<1] += lazy[rt];
        lazy[rt<<1|1] += lazy[rt];
        tree[rt<<1] += lazy[rt] * (mid - l + 1);
        tree[rt<<1|1] += lazy[rt] * (r - mid);
        lazy[rt] = 0;
    }
}

void build(int rt, int l, int r) {
    if (l == r) {
        tree[rt] = a[l];
        return;
    }
    int mid = (l+r)>>1;
    build(rt<<1, l, mid);
    build(rt<<1|1, mid+1, r);
    pushUp(rt);
}

void update(int rt, int l, int r, int L, int R, int k) {
    if (L <= l && r <= R) {
        lazy[rt] += k;
        tree[rt] += (ll)k * (r - l + 1);
        return;
    }
    pushDown(rt, l, r);
    int mid = (l+r)>>1;
    if (L <= mid) update(rt<<1, l, mid, L, R, k);
    if (R > mid) update(rt<<1|1, mid+1, r, L, R, k);
    pushUp(rt);
}

ll query(int rt, int l, int r, int L, int R) {
    if (L <= l && r <= R) return tree[rt];
    pushDown(rt, l, r);
    int mid = (l+r)>>1;
    ll ans = 0;
    if (L <= mid) ans += query(rt<<1, l, mid, L, R);
    if (R > mid) ans += query(rt<<1|1, mid+1, r, L, R);
    return ans;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    build(1, 1, n);
    while (m--) {
        int op, x, y, k;
        scanf("%d", &op);
        if (op == 1) {
            scanf("%d%d%d", &x, &y, &k);
            update(1, 1, n, x, y, k);
        } else {
            scanf("%d%d", &x, &y);
            printf("%lld\n", query(1, 1, n, x, y));
        }
    }
    return 0;
}
```

<img src="../../../src/assets/images/1.png" alt="" >

---

## 4. 归并排序 —— 求逆序对

**例题**：洛谷 P1908 逆序对  
**描述**：给定数组，求逆序对数量（i<j 且 a[i]>a[j]）。

```c
#include <stdio.h>
#define MAXN 500005
#define ll long long

int a[MAXN], tmp[MAXN];
ll ans = 0;

void mergeSort(int l, int r) {
    if (l >= r) return;
    int mid = (l+r)/2;
    mergeSort(l, mid);
    mergeSort(mid+1, r);
    int i = l, j = mid+1, k = l;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) {
            tmp[k++] = a[i++];
        } else {
            tmp[k++] = a[j++];
            ans += mid - i + 1;
        }
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r) tmp[k++] = a[j++];
    for (i = l; i <= r; i++) a[i] = tmp[i];
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    mergeSort(0, n-1);
    printf("%lld\n", ans);
    return 0;
}
```

---

## 5. Dijkstra（堆优化）—— 单源最短路

**例题**：洛谷 P4779 【模板】单源最短路径（标准版）  
**描述**：n 点 m 边有向非负权图，求 s 到所有点的最短路。

```c
#include <stdio.h>
#include <string.h>
#include <limits.h>
#define MAXN 100005
#define MAXM 200005

typedef struct Edge {
    int to, w, next;
} Edge;
Edge edges[MAXM];
int head[MAXN], edgeCnt = 0;
void addEdge(int u, int v, int w) {
    edges[++edgeCnt] = (Edge){v, w, head[u]};
    head[u] = edgeCnt;
}

// 小根堆
typedef struct Node {
    int id, dist;
} Node;
Node heap[MAXN];
int heapSize = 0;

void push(Node x) {
    int i = ++heapSize;
    while (i > 1 && heap[i/2].dist > x.dist) {
        heap[i] = heap[i/2];
        i /= 2;
    }
    heap[i] = x;
}

Node pop() {
    Node ret = heap[1];
    Node last = heap[heapSize--];
    int i = 1, child;
    while (i*2 <= heapSize) {
        child = i*2;
        if (child+1 <= heapSize && heap[child+1].dist < heap[child].dist)
            child++;
        if (last.dist <= heap[child].dist) break;
        heap[i] = heap[child];
        i = child;
    }
    heap[i] = last;
    return ret;
}

int dist[MAXN], visited[MAXN];

void dijkstra(int s, int n) {
    for (int i = 1; i <= n; i++) dist[i] = INT_MAX, visited[i] = 0;
    dist[s] = 0;
    push((Node){s, 0});
    while (heapSize) {
        Node cur = pop();
        if (visited[cur.id]) continue;
        visited[cur.id] = 1;
        for (int e = head[cur.id]; e; e = edges[e].next) {
            int v = edges[e].to, w = edges[e].w;
            if (!visited[v] && dist[v] > dist[cur.id] + w) {
                dist[v] = dist[cur.id] + w;
                push((Node){v, dist[v]});
            }
        }
    }
}

int main() {
    int n, m, s;
    scanf("%d%d%d", &n, &m, &s);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        addEdge(u, v, w);
    }
    dijkstra(s, n);
    for (int i = 1; i <= n; i++) printf("%d ", dist[i]);
    return 0;
}
```

---

## 6. Kruskal —— 最小生成树

**例题**：洛谷 P3366 【模板】最小生成树  
**描述**：n 点 m 边无向图，求最小生成树总权值，不连通输出 `orz`。

```c
#include <stdio.h>
#include <stdlib.h>
#define MAXN 5005
#define MAXM 200005

typedef struct Edge {
    int u, v, w;
} Edge;
Edge edges[MAXM];
int parent[MAXN], rank[MAXN];

void init(int n) {
    for (int i = 1; i <= n; i++) parent[i] = i, rank[i] = 0;
}
int find(int x) {
    return parent[x] == x ? x : (parent[x] = find(parent[x]));
}
void unionSet(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else { parent[ry] = rx; rank[rx]++; }
}

int cmp(const void *a, const void *b) {
    return ((Edge*)a)->w - ((Edge*)b)->w;
}

int main() {
    int n, m;
    scanf("%d%d", &n, &m);
    for (int i = 0; i < m; i++)
        scanf("%d%d%d", &edges[i].u, &edges[i].v, &edges[i].w);
    qsort(edges, m, sizeof(Edge), cmp);
    init(n);
    int cnt = 0, ans = 0;
    for (int i = 0; i < m && cnt < n-1; i++) {
        int u = edges[i].u, v = edges[i].v, w = edges[i].w;
        if (find(u) != find(v)) {
            unionSet(u, v);
            ans += w;
            cnt++;
        }
    }
    if (cnt == n-1) printf("%d\n", ans);
    else printf("orz\n");
    return 0;
}
```

---

## 7. 拓扑排序 —— 判断有向图是否有环

**例题**：洛谷 B3644 【模板】拓扑排序 / 家谱树  
**描述**：给定 n 个点，每个点给出后继列表，输出一种拓扑序。

```c
#include <stdio.h>
#define MAXN 105
#define MAXM 10000

int head[MAXN], indeg[MAXN];
struct Edge { int to, next; } edges[MAXM];
int edgeCnt = 0;
void addEdge(int u, int v) {
    edges[++edgeCnt] = (Edge){v, head[u]};
    head[u] = edgeCnt;
    indeg[v]++;
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        int x;
        while (scanf("%d", &x) && x) addEdge(i, x);
    }
    int queue[MAXN], front = 0, rear = 0;
    for (int i = 1; i <= n; i++) if (indeg[i] == 0) queue[rear++] = i;
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        for (int e = head[u]; e; e = edges[e].next) {
            int v = edges[e].to;
            if (--indeg[v] == 0) queue[rear++] = v;
        }
    }
    return 0;
}
```

---

## 8. 背包 DP —— 0/1 背包

**例题**：洛谷 P1048 采药  
**描述**：采药总时间 T，有 n 株药，每株需要时间 t_i，价值 v_i，求最大价值。

```c
#include <stdio.h>
#define MAXT 1005
#define MAXN 105

int dp[MAXT];

int main() {
    int T, n;
    scanf("%d%d", &T, &n);
    for (int i = 0; i < n; i++) {
        int t, v;
        scanf("%d%d", &t, &v);
        for (int j = T; j >= t; j--) {
            if (dp[j] < dp[j-t] + v)
                dp[j] = dp[j-t] + v;
        }
    }
    printf("%d\n", dp[T]);
    return 0;
}
```

---

## 9. LIS —— 最长上升子序列（O(n log n)）

**例题**：洛谷 B3637 最长上升子序列  
**描述**：给定序列，求最长严格上升子序列长度。

```c
#include <stdio.h>
#define MAXN 100005

int tail[MAXN];

int main() {
    int n, len = 0;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        int x;
        scanf("%d", &x);
        int l = 0, r = len;
        while (l < r) {
            int mid = (l + r) / 2;
            if (tail[mid] < x) l = mid + 1;
            else r = mid;
        }
        tail[l] = x;
        if (l == len) len++;
    }
    printf("%d\n", len);
    return 0;
}
```

---

## 10. LCS —— 最长公共子序列

**例题**：洛谷 P1439 【模板】最长公共子序列（数据特殊，此处给一般 O(n^2) 代码）  
**描述**：求两个字符串的最长公共子序列长度。

```c
#include <stdio.h>
#include <string.h>
#define MAXN 1005

int dp[MAXN][MAXN];
char s1[MAXN], s2[MAXN];

int main() {
    scanf("%s%s", s1+1, s2+1);
    int n = strlen(s1+1), m = strlen(s2+1);
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (s1[i] == s2[j])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = dp[i-1][j] > dp[i][j-1] ? dp[i-1][j] : dp[i][j-1];
    printf("%d\n", dp[n][m]);
    return 0;
}
```

---

## 11. KMP —— 字符串匹配

**例题**：洛谷 P3375 【模板】KMP  
**描述**：给定文本串 s 和模式串 p，输出所有匹配位置，并输出 next 数组。

```c
#include <stdio.h>
#include <string.h>
#define MAXN 1000005

char s[MAXN], p[MAXN];
int next[MAXN];

int main() {
    scanf("%s%s", s, p);
    int n = strlen(s), m = strlen(p);
    // 构建 next
    next[0] = -1;
    int i = 0, j = -1;
    while (i < m) {
        if (j == -1 || p[i] == p[j]) {
            i++; j++;
            next[i] = j;
        } else {
            j = next[j];
        }
    }
    // 匹配
    i = 0, j = 0;
    while (i < n) {
        if (j == -1 || s[i] == p[j]) {
            i++; j++;
        } else {
            j = next[j];
        }
        if (j == m) {
            printf("%d\n", i - m + 1);
            j = next[j];
        }
    }
    for (int k = 1; k <= m; k++) printf("%d ", next[k]);
    return 0;
}
```

---

## 12. 欧拉筛 —— 素数筛

**例题**：洛谷 P3383 【模板】线性筛素数  
**描述**：给定 n，输出 1~n 内的所有素数。

```c
#include <stdio.h>
#define MAXN 100000005

int primes[MAXN], cnt = 0;
char isComposite[MAXN];  // 0表示素数

void eulerSieve(int n) {
    for (int i = 2; i <= n; i++) {
        if (!isComposite[i]) primes[cnt++] = i;
        for (int j = 0; j < cnt && i * primes[j] <= n; j++) {
            isComposite[i * primes[j]] = 1;
            if (i % primes[j] == 0) break;
        }
    }
}

int main() {
    int n, q;
    scanf("%d%d", &n, &q);
    eulerSieve(n);
    while (q--) {
        int k;
        scanf("%d", &k);
        printf("%d\n", primes[k-1]);
    }
    return 0;
}
```

---

## 13. 快速幂 + 逆元 —— 组合数取模

**例题**：给定 n,k,m (m 为质数)，求 C(n,k) mod m。  
**描述**：预处理阶乘和逆元，直接计算。

```c
#include <stdio.h>
#define MAXN 1000005
#define MOD 1000000007
#define ll long long

ll fact[MAXN], invfact[MAXN];

ll fastPow(ll a, ll b, ll mod) {
    ll res = 1;
    while (b) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}

void precompute(int n) {
    fact[0] = 1;
    for (int i = 1; i <= n; i++) fact[i] = fact[i-1] * i % MOD;
    invfact[n] = fastPow(fact[n], MOD-2, MOD);
    for (int i = n-1; i >= 0; i--) invfact[i] = invfact[i+1] * (i+1) % MOD;
}

ll comb(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] * invfact[k] % MOD * invfact[n-k] % MOD;
}

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    precompute(n);
    printf("%lld\n", comb(n, k));
    return 0;
}
```

---

## 14. 凸包 —— 求凸包周长

**例题**：洛谷 P2742 【模板】二维凸包 / [USACO5.1]圈奶牛Fencing the Cows  
**描述**：给定 n 个点，求凸包周长。

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#define MAXN 10005

typedef struct Point {
    double x, y;
} Point;
Point pts[MAXN], convex[MAXN];
int top = 0;

double cross(Point a, Point b, Point c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
double dist(Point a, Point b) {
    double dx = a.x - b.x, dy = a.y - b.y;
    return sqrt(dx*dx + dy*dy);
}

int cmp(const void *a, const void *b) {
    Point *p1 = (Point*)a, *p2 = (Point*)b;
    if (p1->x != p2->x) return (p1->x > p2->x) ? 1 : -1;
    return (p1->y > p2->y) ? 1 : -1;
}

void andrew(int n) {
    qsort(pts, n, sizeof(Point), cmp);
    // 下凸包
    for (int i = 0; i < n; i++) {
        while (top >= 2 && cross(convex[top-2], convex[top-1], pts[i]) <= 0) top--;
        convex[top++] = pts[i];
    }
    // 上凸包
    int lower = top;
    for (int i = n-2; i >= 0; i--) {
        while (top > lower && cross(convex[top-2], convex[top-1], pts[i]) <= 0) top--;
        convex[top++] = pts[i];
    }
    top--; // 去掉重复的起点
}

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%lf%lf", &pts[i].x, &pts[i].y);
    if (n == 1) {
        printf("0.00\n");
        return 0;
    }
    andrew(n);
    double ans = 0;
    for (int i = 0; i < top; i++) {
        ans += dist(convex[i], convex[(i+1) % top]);
    }
    printf("%.2lf\n", ans);
    return 0;
}
```

---

## 15. 单调队列 —— 滑动窗口最大值

**例题**：洛谷 P1886 滑动窗口 /【模板】单调队列  
**描述**：长度为 n 的数组，窗口大小 k，输出每个窗口的最小值和最大值。

```c
#include <stdio.h>
#define MAXN 1000005

int a[MAXN];
int deque[MAXN], front, rear;

int main() {
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);
    // 最小值
    front = 0, rear = 0;
    for (int i = 1; i <= n; i++) {
        while (rear > front && a[deque[rear-1]] >= a[i]) rear--;
        deque[rear++] = i;
        if (deque[front] <= i - k) front++;
        if (i >= k) printf("%d ", a[deque[front]]);
    }
    printf("\n");
    // 最大值
    front = 0, rear = 0;
    for (int i = 1; i <= n; i++) {
        while (rear > front && a[deque[rear-1]] <= a[i]) rear--;
        deque[rear++] = i;
        if (deque[front] <= i - k) front++;
        if (i >= k) printf("%d ", a[deque[front]]);
    }
    return 0;
}
```

---