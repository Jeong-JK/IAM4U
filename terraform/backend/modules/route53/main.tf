resource "aws_route53_zone" "main" {
  name = "datingapp.store"
}

# ─────────────────────────────────────────────
# 인증서 발급 관련 리소스 주석 처리
# ─────────────────────────────────────────────

# resource "aws_acm_certificate" "cert_v2" {
#   domain_name       = "datingapp.team"
#   validation_method = "DNS"
#
#   provider = aws.us_east
#
#   tags = {
#     Name = "datingapp-cert_v2"
#   }
#
#   lifecycle {
#     create_before_destroy = true
#   }
# }

# resource "aws_route53_record" "cert_validation" {
#   for_each = {
#     for dvo in aws_acm_certificate.cert_v2.domain_validation_options : dvo.domain_name => {
#       name  = dvo.resource_record_name
#       type  = dvo.resource_record_type
#       value = dvo.resource_record_value
#     }
#   }
#
#   zone_id = aws_route53_zone.main.zone_id
#   name    = each.value.name
#   type    = each.value.type
#   ttl     = 300
#   records = [each.value.value]
# }

# resource "aws_acm_certificate_validation" "cert_validation_v2" {
#   certificate_arn         = aws_acm_certificate.cert_v2.arn
#   validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
#
#   provider = aws.us_east
# }
