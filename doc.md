# php Markdown Extra

[English](https://michelf.ca/projects/php-markdown/extra/)
[简体中文](https://github.com/yanxyz/php-markdown-extra-doc)
译者：Ivan Yan

Markdown Extra 是 PHP Markdown 的扩展，实现了一些 Markdown 没有的特性。在 [PHP Markdown Lib](http://michelf.ca/projects/php-markdown/) 中是独立的解析器类。

本文档说明 Markdown Extra 对 [Markdown 语法](https://daringfireball.net/projects/markdown/syntax) 的调整及扩展。阅读之前应先熟悉 Markdown 语法。

@[toc](目录)

## 插入 HTML

在 Markdown 中可以插入 HTML 代码。当某些特性 Markdown 不支持而用 HTML 容易实现时，这会很有用。

但是 Markdown 对块级元素有严格的限制。来看 Markdown 语法文档：

> HTML 块级元素，比如 div、table、pre、p 等，与其它内容必须用空行隔开，并且开始与结束标签不能缩进。

Markdown Extra 放宽了这个限制：

1. 块级元素的开始标签不能缩进三个以上的空格，如果多了将按代码块处理。
2. 列表中的块级元素与列表项的缩进一致。更多的缩进也没问题，只要第一个开始标签不是缩进了太多而被当成了代码块，见 #1。

## 在 HTML 块元素内使用 Markdown

以前 Markdown 不能在 `<div>` 元素内放 Markdown 格式的内容。这是因为 `<div>` 元素是块元素，Markdown 不格式化它的内容。

Markdown Extra 支持在块级元素内放 Markdown 格式的内容。为此，给元素添加一个属性 markdown="1"。例如：

    <div markdown="1">
    This is *true* markdown text.
    </div>

转换时属性 markdown="1" 将删除，`<div>` 的内容从 Markdown 转为 HTML。最后结果为：

    <div>
    <p>This is <em>true</em> markdown text.</p>
    </div>

对于有 markdown 属性的块元素，Markdown Extra 会智能地根据元素的类型正确的格式化。例如 当 markdown="1" 添加到 `<p>` 元素上，将只产生内联元素，不会出现列表、块引用、代码块。

但是有一些模棱两可的情况，例如：

    <table>
    <tr>
    <td markdown="1">This is *true* markdown text.</td>
    </tr>
    </table>

表格单元格可以同时包含内联元素与块级元素，这时只生成内联元素。如果想生成块级元素，则添加属性 markdown="block" 。

## 特殊属性

Markdown Extra 中可以用属性块给元素添加 id 与 class。例如标题，在标题行的末尾， id 以 # 开头并用大括号括起来，像这样：

    Header 1            {#header1}
    ========

    ## Header 2 ##      {#header2}

然后可以创建链接，指向文档的不同部分，例如：

    [Link back to header 1](#header1)

添加 class，以便在样式表中使用，使用圆点，例如:

    ## The Site ##    {.main}

可以添加自定义属性，属性值不能有空格：

	## Le Site ##    {lang=fr}

可以同时添加id，多个 class 值及其它自定义属性：

    ## Le Site ##    {.main .shine #the-site lang=fr}

目前可以给下面元素添加属性块：

- 标题
- 围栏式代码块
- 链接
- 图片

对于链接与图片，将属性块添加到地址圆括号后面：

    [link](url){#id .class}
    ![img](url){#id .class}

如果是引用风格链接与图片，则添加到定义的末尾：

    [link][linkref] or [linkref]
    ![img][linkref]

    [linkref]: url "optional title" {#id .class}

## 围栏式代码块

Markdown Extra 新增了不使用缩进的代码块语法：围栏式代码块。像 Markdown 的代码块一样，不过不用缩进，而由开始与结束的栅栏行来界定代码块。代码块的开始行由三个或更多的 `~` 组成，结束行由相同数量的 `~` 组成。例如：

    This is a paragraph introducing:

    ~~~~~~~~~~~~~~~~~~~~~
    a one-line code block
    ~~~~~~~~~~~~~~~~~~~~~

也可以用反引号 \` :

    ``````````````````
    another code block
    ``````````````````


与缩进式代码块相比，围栏式代码块的开始与结尾可以是空行：

    ~~~

    blank line before
    blank line after

    ~~~

缩进式代码块不能直接跟在列表后面，因为这时的缩进优先考虑列表。围栏式代码块没这个限制：

    1.  List item

            Not an indented code block, but a second paragraph
            in the list item

    ~~~~
    This is a code block, fenced-style
    ~~~~

当编辑器不能缩进文本块时围栏式代码块就很有用，比如浏览器中的文本框。

可以给围栏式代码块指定一个 class, 这很有用，比如根据代码语言对代码块使用不同的样式，或者告诉语法高亮工具使用什么语法。

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ .html
    <p>paragraph <b>emphasis</b>
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class 放到开始行的末尾， 圆点 `.` 不是必需的。也可以用特殊属性块：

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ {.html #example-1}
    <p>paragraph <b>emphasis</b>
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在转换为 HTML 时属性将添加到 `<code>` 元素上。如果想添加到 `<pre>` 元素上，在配置中指定  `code_attr_on_pre` 为 true 。详情查看 [configuration](http://michelf.ca/projects/php-markdown/configuration/) 。

## 表格

Markdown Extra 使用自己的语法来创建简单的表格。“简单”是指这样的：

    First Header  | Second Header
    ------------- | -------------
    Content Cell  | Content Cell
    Content Cell  | Content Cell

第一行是标题行；第二行是分隔行，将标题行与内容行隔开；再下面的每一行都是表格行。列之间由管道符(|)隔开。转换为 HTML 的结果：

    <table>
        <thead>
            <tr>
                <th>First Header</th>
                <th>Second Header</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Content Cell</td>
                <td>Content Cell</td>
            </tr>
            <tr>
                <td>Content Cell</td>
                <td>Content Cell</td>
            </tr>
        </tbody>
    </table>

也可以在每行的首尾加上管道符。使用哪种形式随你喜欢，结果是一样的：

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

注意每行至少得有一个管道符，这样 Markdown Extra 才能正确解析。这意味着在创建单列表格时，正确的做法是在每行的头部或末尾，或两处都加上管道符。

可以在分隔行里加上冒号来指定该列的对齐方式。冒号在左边则该列左对齐，在右边则该列右对齐，在两边则该列居中对齐。

    | Item      | Value |
    | --------- | -----:|
    | Computer  | $1600 |
    | Phone     |   $12 |
    | Pipe      |    $1 |

align 属性将添加到相关列的每个单元格。

单元格内可以用内联元素的 Markdown ：

    | Function name | Description                    |
    | ------------- | ------------------------------ |
    | `help()`      | Display the help window.       |
    | `destroy()`   | **Destroy your computer!**     |

## 定义列表

Markdown Extra 支持定义列表。定义列表很像词典，由术语及其定义组成。

简单的定义列表由独占一行的术语，加上以冒号开头的定义组成：

    Apple
    :   Pomaceous fruit of plants of the genus Malus in
            the family Rosaceae.

    Orange
    :   The fruit of an evergreen tree of the genus Citrus.

术语与上条定义之间必须用空行隔开。定义可能多行，这时理应缩进，但是偷懒不缩进也行：

    Apple
    :   Pomaceous fruit of plants of the genus Malus in
    the family Rosaceae.

    Orange
    :   The fruit of an evergreen tree of the genus Citrus.

结果一样：

    <dl>
    <dt>Apple</dt>
    <dd>Pomaceous fruit of plants of the genus Malus in
    the family Rosaceae.</dd>

    <dt>Orange</dt>
    <dd>The fruit of an evergreen tree of the genus Citrus.</dd>
    </dl>

冒号作为定义标记放在左边界，不过可以缩进最多三个空格。它后面必须有一或多个空格或制表符。

一个术语可以有多个定义：

    Apple
    :   Pomaceous fruit of plants of the genus Malus in
            the family Rosaceae.
    :   An American computer company.

    Orange
    :   The fruit of an evergreen tree of the genus Citrus.

也可以多个术语共享一个定义：

    Term 1
    Term 2
    :   Definition a

    Term 3
    :   Definition b

如果定义上面有一空行，则转换为 HTML 后定义由 `<p>` 标签包裹。例如：

    Apple

    :   Pomaceous fruit of plants of the genus Malus in
            the family Rosaceae.

    Orange

    :    The fruit of an evergreen tree of the genus Citrus.

结果：

    <dl>
    <dt>Apple</dt>
    <dd>
    <p>Pomaceous fruit of plants of the genus Malus in
    the family Rosaceae.</p>
    </dd>

    <dt>Orange</dt>
    <dd>
    <p>The fruit of an evergreen tree of the genus Citrus.</p>
    </dd>
    </dl>

像普通列表一样，定义可以包含多个段落，以及其它的块级元素，比如引用、代码块、列表，甚至是其它的定义列表。

    Term 1

    :   This is a definition with two paragraphs. Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit. Aliquam
        hendrerit mi posuere lectus.

        Vestibulum enim wisi, viverra nec, fringilla in, laoreet
        vitae, risus.

    :   Second definition for term 1, also wrapped in a paragraph
        because of the blank line preceding it.

    Term 2

    :   This definition has a code block, a blockquote and a list.

            code block.

        > block quote
        > on two lines.

        1.  first list item
        2.  second list item

## 脚注

脚注跟参考链接相似。脚注由两部分组成：上标数字与脚注定义。脚注定义将放到文档末尾的脚注列表中。例如：

    That's some text with a footnote.[^1]

    [^1]: And that's the footnote.

脚注定义可以放在文档中的任意位置，但是脚注将按链接文本的先后位置排列。注意一个脚注不能链接到两个地方，否则第二个脚注将视为普通文本。

每个脚注必须有一个唯一的名字，这个名字用来链接到脚注定义，但是不影响脚注的编号。HTML 中 id 属性值可以使用的字符，名字都可以用。

脚注可以包含块级元素，可以将多个段落、列表、块引用等放在脚注里。跟列表项一样，只需要让下面段落在定义中缩进四个空格：

    That's some text with a footnote.[^1]

    [^1]: And that's the footnote.

        That's the second paragraph.

想排版得更好看，可以让脚注的第一行为空，第一个段落放到下一行：

    [^1]:
        And that's the footnote.

        That's the second paragraph.

### 输出

只能输出一种脚注标记肯定不能满足所有人的需求，将来的版本可能提供一个接口，允许生成不同的标记。但是目前的输出与 [Daring
Fireball](http://daringfireball.net/2005/07/footnotes) 的示例一样，只是有稍许不同。下面是上面第一个例子的输出：

    <p>That's some text with a footnote.
        <sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup></p>

    <div class="footnotes">
    <hr />
    <ol>

    <li id="fn-1">
    <p>And that's the footnote.
        <a href="#fnref-1" class="footnote-backref">&#8617;</a></p>
    </li>

    </ol>
    </div>

看着有点晕，不过在浏览器中看是这样的：

<div class="html">
    <p>That’s some text with a footnote.<sup id="fnref-1"><a href="#fn:1" class="footnote-ref">1</a></sup></p>
    <div class="footnotes">
    	<hr>
		<ol>
		<li id="fn-1">
		<p>And that’s the footnote.
		    <a href="#fnref-1" class="footnote-backref">&#8617;</a></p>
		</li>
		</ol>
    </div>
</div>

链接的属性 class="footnote-ref" 与 class="footnote-backref" 表明了它们与目标元素的关系。可以用 CSS 给链接添加样式：

    a.footnote-ref { ... }
    a.footnote-backref { ... }

也可以自定义链接的 class 与 title。详情查看 [configuration](http://michelf.ca/projects/php-markdown/configuration/) 。

## 缩略词

Markdown Extra 支持缩略词（`<abbr>` 标签）。语法很简单，像这样定义：

    *[HTML]: Hyper Text Markup Language
    *[W3C]: World Wide Web Consortium

然后在文档任意地方写上这样的文本：

    The HTML specification
    is maintained by the W3C.

结果：

    The <abbr title="Hyper Text Markup Language">HTML</abbr> specification
    is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

缩略词区分大小写，定义的时候可以是多个单词。缩略词的定义为空时仍然生成 `<abbr>` 标签，但是没有 title 属性。

    Operation Tigra Genesis is going well.

    *[Tigra Genesis]:

缩略词定义可以放在文档的任意位置，转换时将删除。

## 有序列表

如果有序列表的开始编号不是 1，Markdown Extra 将在 HTML 中使用这个开始编号。

## 强调

Markdown Extra 稍微改变了 Markdown 的强调语法。单词内的下划线按字面字符对待，下划线强调只对整个单词有效。如果想强调单词的部分内容，使用星号。

比如：

    Please open the folder "secret_magic_box".

Markdown Extra 不会将下划线转为强调，因为它们位于单词内，HTML 结果为：

    <p>Please open the folder "secret_magic_box".</p>

下划线强调仍然能用，只要是像这样强调整个单词：

    I like it when you say _you love me_.

着重强调 (`<strong>` 标签) 一样：在单词内强调不能用下划线，只能用星号。

## 转义

Markdown Extra 将冒号(:)与管道符(|)添加到可以用反斜杠(\\)转义的字符列表中，防止它们被用来生成定义列表或表格。

## 致谢

上面许多想法在 [Markdown 讨论列表](http://daringfireball.net/projects/markdown/#discussion-list) 上讨论过。感谢所有参加讨论的人，感谢实现与改进 Markdown 语法的人。
