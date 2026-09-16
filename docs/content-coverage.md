# 文档内容覆盖与维护

核对日期：2026-09-16。本轮在原有中英文内容上新增卡密库存、API 在线调试和外部 API 发货确认，并同步商品、订单与发布记录。

## 核对方式

公开说明以 connect 后端路由和业务实现、tdcloud.cc 前端实际页面为依据。核对时后端已推送 HEAD 为 `eaf4bc7`，前端已推送 HEAD 为 `394f9c2`；本地另有尚未提交的平台内调试免填 Secret 和外部 API 发货确认实现。对应页面明确标注其待提交、迁移和部署状态，不以“源码存在”宣称生产可用。文档站的构建与上线验收只证明文档可读，不代表库存迁移、第三方发货、支付或后台任务通过生产业务验收。

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
| merchant/inventory | 后端 local_inventory、fulfillment_tasks 及商户/后台库存路由；前端 InventoryCenter.vue、ProductInventory.vue |
| merchant/payments | merchantPaymentChannelsEnabled=false；internal/domain/shopping/order.go 中商户收入结算 |
| merchant/orders | internal/service/pay/order.go 中订单收入与交付回调；前端商户订单 |
| developer/quickstart | internal/router/platform/router.go、internal/service/platform/oauth.go、internal/api/platform/oauth.go |
| developer/api-console | 前端 developer/console.vue、api-console.ts、oauth-debug.ts；后端平台调试回调与 OAuth token 标记 |
| developer/fulfillment-api | 当前未提交的 internal/pkg/fulfillmentapi、external_fulfillment.go、fulfillment callback 路由和 0041 迁移 |
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
- 本地独占卡密按购买数量逐条预留和交付；商品数量汇总不能替代库存明细事实。
- 平台内 OAuth 调试回调可免填机密客户端 Secret，但普通外部回调、外部 Refresh Token 和 client_credentials 不因此放宽。
- 外部 API 发货只有签名业务状态 `delivered` 才能完成订单，HTTP 2xx 不是交付确认。

## 后续补文档的触发条件

| 主题 | 先确认什么 |
| --- | --- |
| 商户自有渠道 | 真实启用条件、手续费、超时关闭、服务商回调与对账 |
| 退款、提现、用户间转账 | 已公开的入口、权限、状态和真实业务流程 |
| OAuth 撤销与 OIDC SDK | 撤销路由、Discovery/JWKS 与令牌验证契约 |
| OpenAPI 渠道发现、报价、订单列表 | 对应已发布路由、Scope、字段和兼容规则 |
| 外部 API 发货生产启用 | 0041 迁移、密钥配置、前后端部署、真实公网供应端签名与超时查询验收 |
| 商品私有范围 | 公开查询、详情、下单路径的访问控制与验收 |
| 管理员运营手册 | 面向管理员的配置范围、角色分工与部署支持边界 |

不要给上述尚不完整的能力编写看似可执行的步骤，也不要承诺发布日期。

## 内容校验

- 中英文页面路径、导航顺序和接口示例保持一致。
- 检查站内链接能落到真实页面，示例 JSON 可解析。
- 执行 pnpm run ci，确认静态产物包含所有新增页面。
- 发布后校验部署版本、新页面和引用资源，再检查中英文导航及移动端阅读。
