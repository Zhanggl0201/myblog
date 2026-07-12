---
title: 端午大礼包-C语言练习题
published: 2026-06-22
pinned: false
draft: false
category: C/C++
tags: [C/C++, 改错题, 填空题, 编程题, 字符串, 数组, 综合练习]
image: "https://cdn.jsdmirror.cn/gh/Zhanggl0201/blog-images@main/HonkaiStarRail/Jingliu/002.webp"
---

## 改错题

### 改错题1-统计0的个数

**题目描述：** 统计一个无符号整数中各位数字值为0的个数，通过形参传回主函数，并把该整数中各位上最大的数字值作为函数值返回。

例如：若输入无符号整数30800，则数字值为0的位的个数为3，各位上数字值最大的是8。

```c
#include <stdio.h>

int fun(unsigned n, int* zero)
{
    int count = 0, max = 0, t;
    do
    {
        t = n % 10;          // 取出最低位数字
        /***********FOUND***********/
        if (t == 0)          // 如果该位是0，计数器加1
            count++;
        if (max < t)         // 如果该位比max大，更新max
            max = t;
        n = n / 10;          // 去掉最低位
    } while (n);             // 直到n为0
    /***********FOUND***********/
    *zero = count;           // 通过指针返回0的个数
    return max;              // 返回最大数字
}

main()
{
    unsigned n;
    int zero, max;
    printf("\nInput n(unsigned): ");
    scanf("%d", &n);
    max = fun(n, &zero);
    printf("\nThe result: max=%d\n zero=%d\n", max, zero);
}
```

**解题思路：**
1. 使用do-while循环依次处理整数的每一位
2. 通过 `n % 10` 获取最低位数字，通过 `n / 10` 去掉已处理位
3. 统计值为0的位数，同时记录最大数字
4. 通过指针参数 `*zero` 返回0的个数，函数直接返回最大数字

---

### 改错题2-第一个字母改大写

**题目描述：** 读入一个英文文本行，将其中每个单词的第一个字母改成大写，然后输出此文本行。

例如：输入"I am a student to take the examination"，则应输出"I Am A Student To Take The Examination"。

```c
#include  <stdlib.h>
#include  <string.h>
#include  <conio.h>
#include  <ctype.h>
#include  <stdio.h>
#include  <string.h>

/***********FOUND***********/
void upfst(char* p)
{
    int k = 0;               // k=0表示在单词开头，k=1表示在单词中间
    for (; *p; p++)
    {
        if (k)
        {
            if (*p == ' ')   // 遇到空格，说明下一个非空格是单词首字母
                k = 0;
        }
        else
        {
            if (*p != ' ')   // 当前不是空格，说明是单词首字母
            {
                k = 1;       // 标记已进入单词
                *p = toupper(*p);  // 转换为大写
            }
        }
    }
}
void main()
{
    char  chrstr[81];
    system("CLS");
    printf("\nPlease enter an English text line: ");
    gets(chrstr);
    printf("\nBofore changing:\n  %s", chrstr);
    upfst(chrstr);
    printf("\nAfter changing:\n  %s\n", chrstr);
}
```

**解题思路：**
1. 使用标志位 `k` 区分当前是否在单词内部
2. `k=0` 表示在单词开头（需要处理首字母），`k=1` 表示在单词中间
3. 遇到空格时将k置0，表示下一个非空格字符是单词首字母
4. 使用 `toupper()` 函数将小写字母转换为大写

---

### 改错题3-查找字符串最后出现地址

**题目描述：** 求出s所指字符串中最后一次出现的t所指字符串的地址，并通过函数值返回；若未找到，则函数值为NULL。

例如：字符串"abcdabfabcdx"中"ab"最后出现的位置开始的字符串是"abcdx"。

```c
#include  <stdio.h>
#include  <string.h>

char* fun(char* s, char* t)
{
    char* p, * r, * a;
    /***********FOUND***********/
    a = NULL;                 // 初始化为NULL，找不到时返回NULL
    while (*s)               // 遍历s中的每个位置作为起始点
    {
        p = s;
        r = t;
        while (*r)            // 从t的开头开始比较
            /***********FOUND***********/
            if (*r == *p)     // 如果字符相同，继续比较下一个
            {
                r++;
                p++;
            }
            else              // 如果字符不同，退出内层循环
                break;
        if (*r == '\0')       // 如果t全部比较完成，说明找到了匹配
            a = s;            // 更新a为当前匹配的首地址
        s++;                  // s向后移动一位，继续查找
    }
    return a;                 // 返回最后一次匹配的首地址
}

main()
{
    char   s[100], t[100], * p;
    printf("\nPlease enter string S :");
    scanf("%s", s);
    printf("\nPlease enter substring t :");
    scanf("%s", t);
    p = fun(s, t);
    if (p)
        printf("\nThe result is :  %s\n", p);
    else
        printf("\nNot found !\n");
}
```

**解题思路：**
1. 使用双层循环，外层遍历s中每个可能的起始位置，内层比较从该位置开始的子串是否等于t
2. 每次找到匹配时更新 `a = s`，这样循环结束后a保存的是最后一次匹配的位置
3. 如果从未找到匹配，a保持为NULL
4. 通过 `*r == '\0'` 判断t是否全部匹配完成

---

### 改错题4-找到最长子串

**题目描述：** 从N个字符串中找出最长的串，并将其地址作为函数值返回。

```c
#include <stdio.h>
#include <string.h>

#define    N   5
#define    M   81

/***********FOUND***********/
char* fun(char  (*sq)[M])    // sq是指向字符串数组的指针
{
    int  i;     char* sp;
    sp = sq[0];              // 初始化为第一个字符串的地址
    for (i = 0; i < N; i++)
        if (strlen(sp) < strlen(sq[i]))  // 如果当前最长串比第i个串短
            sp = sq[i];      // 更新sp为第i个串的地址
    /***********FOUND***********/
    return sp;               // 返回最长字符串的地址
}
main()
{
    char   str[N][M], * longest;    int   i;
    printf("Enter %d lines :\n", N);
    for (i = 0; i < N; i++)
        gets(str[i]);
    printf("\nThe %d string  :\n", N);
    for (i = 0; i < N; i++)
        puts(str[i]);
    longest = fun(str);
    printf("\nThe longest string :\n");
    puts(longest);
}
```

**解题思路：**
1. 函数参数 `char (*sq)[M]` 是指向含有M个元素的字符数组的指针，即字符串数组
2. 初始化 `sp = sq[0]` 指向第一个字符串
3. 遍历所有N个字符串，用 `strlen()` 比较长度
4. 如果发现更长的字符串，则更新 `sp` 为其地址
5. 循环结束后返回 `sp`，即最长字符串的地址

---

### 改错题5-调整ASCII最大字符放首位

**题目描述：** 从p所指字符串中找出ASCII码值最大的字符，将其放在第一个位置上，并将该字符前的原字符向后顺序移动。

例如："ABCDeFGH"调用后应变为"eABCDFGH"。

```c
#include <stdio.h>

void fun(char* p)
{
    char   max, * q;   int   i = 0;
    max = p[i];                    // 假设第一个字符最大
    while (p[i] != 0)             // 遍历字符串
    {
        if (max < p[i])            // 如果发现更大的字符
        {
            max = p[i];            // 更新最大字符值
            /***********FOUND***********/
            q = p + i;             // 记录最大字符的位置
        }
        i++;
    }
    /***********FOUND***********/
    while (q > p)                  // 将最大字符前的字符向后移动
    {
        *q = *(q - 1);             // 依次后移
        q--;
    }
    p[0] = max;                    // 将最大字符放到首位
}
main()
{
    char   str[80];
    printf("Enter a string:  ");
    gets(str);
    printf("\nThe original string:      ");
    puts(str);
    fun(str);
    printf("\nThe string after moving:  ");
    puts(str); printf("\n\n");
}
```

**解题思路：**
1. 第一次遍历找出ASCII码最大的字符及其位置，用指针q记录
2. 第二次从最大字符位置向前，将每个字符向后移动一位
3. 最后将最大字符放到字符串首位
4. 例如"ABCDeFGH"，'e'的ASCII码最大，从位置4开始前移，最后变成"eABCDFGH"

---

## 填空题

### 填空题3-字符串中数字累加和

**题目描述：** 将形参s所指字符串中的数字字符转换成对应的数值，计算出这些数值的累加和作为函数值返回。

例如：字符串"abs5def126jkm8"，程序执行后的输出结果为22。

```c
#include  <stdio.h>
#include  <string.h>
#include  <ctype.h>

int fun(char* s)
{
    int  sum = 0;
    while (*s)                     // 遍历字符串
    {
        if (isdigit(*s))           // 如果是数字字符
            /***********SPACE***********/
            sum += *s - 48;        // 转换为数值并累加（'0'的ASCII码是48）
        /***********SPACE***********/
        s++;                       // 移动到下一个字符
    }
    /***********SPACE***********/
    return  sum;                  // 返回累加和
}
main()
{
    char  s[81];
    int  n;
    printf("\nEnter a string:\n\n");
    gets(s);
    n = fun(s);
    printf("\nThe result is:  %d\n\n", n);
}
```

**解题思路：**
1. 使用 `isdigit()` 判断字符是否为数字字符
2. 将数字字符转换为对应数值：`*s - '0'` 或 `*s - 48`（因为'0'的ASCII码是48）
3. 累加所有数字字符的值，遍历完字符串后返回总和

---

### 填空题4-插入字符

**题目描述：** 在形参s所指字符串中寻找与参数c相同的字符，并在其后插入一个与之相同的字符。

例如：字符串"baacda"中插入'a'后结果为"baaaacdaa"。

```c
#include    <stdio.h>

void fun(char* s, char  c)
{
    int  i, j, n;
    /***********SPACE***********/
    for (i = 0; s[i] != '\0'; i++)  // 遍历字符串
        if (s[i] == c)              // 如果找到与c相同的字符
        {
            /***********SPACE***********/
            n = i;                  // 记录当前位置
            while (s[i + 1 + n] != '\0')  // 计算字符串剩余长度
                n++;
            for (j = i + n + 1; j > i; j--)  // 将后面字符后移一位
                s[j + 1] = s[j];
            /***********SPACE***********/
            s[j + 1] = c;           // 在该字符后插入相同的字符
            i = i + 1;              // 跳过刚插入的字符
        }
}
main()
{
    char  s[80] = "baacda", c;
    printf("\nThe string:  %s\n", s);
    printf("\nInput a character:  ");
    scanf("%c", &c);
    fun(s, c);
    printf("\nThe result is:  %s\n", s);
}
```

**解题思路：**
1. 遍历字符串，当找到与c相同的字符时
2. 计算从该位置到字符串末尾的长度
3. 将该位置后的所有字符向后移动一位
4. 在原字符后插入一个相同的字符
5. 注意插入后要跳过刚插入的字符，避免重复处理

---

### 填空题5-最长字符串

**题目描述：** 求出形参ss所指字符串数组中最长字符串的长度，其余字符串左边用字符*补齐。

```c
#include    <stdio.h>
#include    <string.h>

#define    M    5
#define    N    20

void fun(char  (*ss)[N])
{
    int  i, j, k = 0, n, m, len;
    for (i = 0; i < M; i++)
    {
        len = strlen(ss[i]);
        if (i == 0) n = len;
        if (len > n)
        {
            /***********SPACE***********/
            n = len; k = i;        // 记录最长串的长度和索引
        }
    }
    for (i = 0; i < M; i++)
        if (i != k)                // 对非最长串进行填充
        {
            m = n;
            len = strlen(ss[i]);
            /***********SPACE***********/
            for (j = len; j >= 0; j--)  // 将原字符串移到右侧
                ss[i][m--] = ss[i][j];
            for (j = 0; j < n - len; j++)  // 左侧填充*
                /***********SPACE***********/
                ss[i][j] = '*';
        }
}
main()
{
    char  ss[M][N] = { "shanghai","guangzhou","beijing","tianjing","cchongqing" };
    int  i;
    printf("\nThe original strings are :\n");
    for (i = 0; i < M; i++)  printf("%s\n", ss[i]);
    printf("\n");
    fun(ss);
    printf("\nThe result:\n");
    for (i = 0; i < M; i++)
        printf("%s\n", ss[i]);
}
```

**解题思路：**
1. 第一遍遍历找出最长字符串的长度 `n` 及其索引 `k`
2. 第二遍遍历其他字符串，将每个字符串的内容移到右侧
3. 在左侧空出的位置填充字符 '*'
4. 最终所有字符串都与最长串等长

---

## 编程题

### 编程题1-二维数组变一维

**题目描述：** 将M行N列的二维数组中的字符数据，按列的顺序依次放到一个字符串中。

例如：二维数组
```
W W W W
S S S S
H H H H
```
则字符串中的内容应是：WSHWSHWSHWSH。

```c
#include<stdio.h>

#define  M  3
#define  N  4

void fun(char (*s)[N], char* b)
{
    /**********Program**********/
    int i, j, k = 0;
    for (j = 0; j < N; j++)        // 外层循环控制列
    {
        for (i = 0; i < M; i++)    // 内层循环控制行
        {
            b[k++] = s[i][j];      // 按列顺序取出元素
        }
    }
    b[k] = '\0';                   // 添加字符串结束符
    /**********  End  **********/
}
void main()
{
    char a[100];
    char w[M][N] = { { 'W', 'W', 'W', 'W'},{'S', 'S', 'S', 'S'},
        {'H', 'H', 'H', 'H'} };
    int i, j;
    printf("The matrix:\n");
    for (i = 0;i < M;i++)
    {
        for (j = 0;j < N;j++)
            printf("%3c", w[i][j]);
        printf("\n");
    }
    fun(w, a);
    printf("The A string:\n");
    puts(a);
    printf("\n\n");
}
```

**解题思路：**
1. 外层循环遍历每一列，内层循环遍历每一行
2. 按列顺序依次取出元素放入一维数组b中
3. 先取第0列的0-M行，再取第1列的0-M行...依次类推
4. 最后添加字符串结束符 '\0'

---

### 编程题2-删除字符

**题目描述：** 将s所指字符串中ASCII值为奇数的字符删除，剩余字符形成新串放在t所指数组中。

例如："ABCDEFG12345"中A(65奇数)、1(49奇数)删除后结果是"BDF24"。

```c
#include <stdio.h>
#include <string.h>

void  fun(char* s, char  t[])
{
    /**********Program**********/
    int i, j = 0;
    for (i = 0; s[i] != '\0'; i++)  // 遍历字符串s
    {
        if (s[i] % 2 == 0)          // ASCII值为偶数时保留
        {
            t[j++] = s[i];          // 复制到t数组
        }
    }
    t[j] = '\0';                    // 添加字符串结束符
    /**********  End  **********/
}

void main()
{
    char   s[100], t[100];
    printf("\nPlease enter string S:");
    scanf("%s", s);
    fun(s, t);
    printf("\nThe result is: %s\n", t);
}
```

**解题思路：**
1. 遍历字符串s中的每个字符
2. 通过 `s[i] % 2 == 0` 判断ASCII值是否为偶数
3. 将ASCII值为偶数的字符依次复制到数组t中
4. 最后在t末尾添加结束符 '\0'

---

### 编程题3-统计数字个数

**题目描述：** 统计s所指字符串中的数字字符个数，并作为函数值返回。

例如："2def35adh25  3kjsdf 7/kj8655x"，函数返回值为11。

```c
#include  <stdio.h>

int fun(char  *s)
{        
    /**********Program**********/
    int i, count = 0;
    for (i = 0; s[i] != '\0'; i++)  // 遍历字符串
    {
        if (s[i] >= '0' && s[i] <= '9')  // 判断是否为数字字符
        {
            count++;                // 计数器加1
        }
    }
    return count;                  // 返回数字字符个数
    /**********  End  **********/
}

void main()
{  
    char *s = "2def35adh25  3kjsdf 7/kj8655x";
    printf("%s\n", s);
    printf("%d\n", fun(s));
}
```

**解题思路：**
1. 遍历字符串中的每个字符
2. 使用条件 `s[i] >= '0' && s[i] <= '9'` 判断是否为数字字符
3. 每找到一个数字字符，计数器加1
4. 遍历结束后返回计数器的值

---

### 编程题4-返回n-1的数

**题目描述：** w是一个大于10的无符号整数，若w是n(n≥2)位的整数，则函数求出w的后n－1位的数作为函数值返回。

例如：w值为5923，则函数返回923；若w值为923，则函数返回23。

```c
#include<conio.h>
#include<stdio.h>
#include<stdlib.h>

unsigned fun(unsigned w)
{
    /**********Program**********/
    int n = w, t = 1;
    while (n > 0)               // 计算w的位数对应的10的幂
    {
        t = t * 10;
        n = n / 10;
    }
    return w % (t / 10);        // 去掉最高位，返回后n-1位
    /**********  End  **********/
}
void main()
{
    unsigned x;
    printf("Enter a unsigned integer number: ");
    scanf("%u", &x);
    printf("The original data is:%u\n", x);
    if (x < 10)
        printf("Data error! ");
    else
        printf("The result :%u\n", fun(x));
}
```

**解题思路：**
1. 首先通过循环计算出原数字w的位数对应的10的幂t
2. 例如5923有4位，循环后t=10000（比原数多一位）
3. `t / 10` 得到1000，然后用 `w % (t / 10)` 去掉最高位
4. 5923 % 1000 = 923，923 % 100 = 23
