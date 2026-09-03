# 文档内容覆盖与维护

核对日期：2026-09-03。本轮补齐 15 个主题、30 篇中英文页面，另增加 2 篇 FAQ 目录页；入口、FAQ 和原有开发者说明同步修订。

## 核对方式

公开说明以 connect 后端路由和业务实现、tdcloud.cc 前端实际页面为依据。核对时后端 HEAD 为 45f3359，相关工作区另有未提交的 OAuth 与前端改动，因此不以“源码存在”宣称这些改动已经生产验收。文档站的构建与上线验收只证明文档可读，不代表充值、第三方支付、交付服务或后台任务通过业务验收。

修改文档前重新核对相应实现。下面的路径相对于各自仓库；业务设计稿用于定位，不作为功能已经开放的证据。

## 主题与实现依据

| 文档主题（zh/en 同路径） | 核对依据 |
| --- | --- |
| getting-started/quickstart | 前端 src/router/index.ts、login、register、shop、orders 页面 |
| getting-started/account | 前端 client/profile、client/settings；后端 internal/router/users/router.go |
| getting-started/connections | 前端 client/connections：GitHub 绑定/解绑，Telegram bindSupported=false |
| getting-started/notifications | 前端 client/notifications、client/settings：消息、已读、删除、强制偏好 |
| shopping/index、shopping/orders | 后端 internal/service/pay/user.go、order.go、expiry.go；internal/domain/shopping/order.go |
| currency/wallet | 前端 client/wallet、client/transactions、client/topup；后端钱包与充值实现 |
| merchant/index | 后端 internal/service/platform/merchant.go；前端 client/merchant/index.vue |
| merchant/products | 后端 internal/api/platform/merchant_workbench.go、internal/service/shopping/product.go；前端 ProductEditorForm.vue |
| merchant/payments | merchantPaymentChannelsEnabled=false；internal/domain/shopping/order.go 中商户收入结算 |
| merchant/orders | internal/service/pay/order.go 中订单收入与交付回调；前端商户订单 |
| developer/quickstart | internal/router/platform/router.go、internal/service/platform/oauth.go、internal/api/platform/oauth.go |
| developer/data-formats | internal/pkg/money/money.go、internal/service/pay/type.go、order.go、internal/pkg/payment/pay.go |
| developer/commerce | internal/api/platform/openapi.go、internal/service/platform/order.go、internal/service/pay/pay.go |
| developer/troubleshooting | OAuth/OpenAPI handlers、internal/pkg/response/errors.go、平台路由清单 |

## 本轮纠正的边界

- 商品和订单金额统一以 10^-8 定点整数传输；币种 decimals 不改变缩放。
- orders.read 按授权用户与绑定商户检查，不额外限制为同一个客户端创建的订单。
- OAuth 授权页面由平台登录态处理，不能把所有 OAuth 路径一概描述为 Access Token 接口。
- 商户自有支付渠道未开放；TDC 支付请求可能实际扣款，不能作为只读报价。
- 第三方账号连接不是 OAuth 授权撤销列表。
- 商品销售范围字段当前不能作为私有访问控制保证。
- 交付 Idempotency-Key 是去重标识，不是签名或身份认证。
- 付款查询状态与订单状态是两套数值定义。

## 后续补文档的触发条件

| 主题 | 先确认什么 |
| --- | --- |
| 商户自有渠道 | 真实启用条件、手续费、超时关闭、服务商回调与对账 |
| 退款、提现、用户间转账 | 已公开的入口、权限、状态和真实业务流程 |
| OAuth 撤销与 OIDC SDK | 撤销路由、Discovery/JWKS 与令牌验证契约 |
| OpenAPI 渠道发现、报价、订单列表 | 对应已发布路由、Scope、字段和兼容规则 |
| 商品私有范围 | 公开查询、详情、下单路径的访问控制与验收 |
| 管理员运营手册 | 面向管理员的配置范围、角色分工与部署支持边界 |

不要给上述尚不完整的能力编写看似可执行的步骤，也不要承诺发布日期。

## 内容校验

- 中英文页面路径、导航顺序和接口示例保持一致。
- 检查站内链接能落到真实页面，示例 JSON 可解析。
- 执行 pnpm run ci，确认静态产物包含所有新增页面。
- 发布后校验部署版本、新页面和引用资源，再检查中英文导航及移动端阅读。
