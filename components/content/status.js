export default function getStatusCodeText(code) {
    let body = "";
    switch (code) {
        case 200:
            body = "200_ok";
            break;
        case 202:
            body = "202_accepted";
            break;
        case 204:
            body = "204_no_content";
            break;
        case 230:
            body = "202_accepted";
            break;
        case 240:
            body = "240_register_accepted";
            break;
        case 250:
            body = "250_post_publish_accepted";
            break;
        case 260:
            body = "260_event_publish_accepted";
            break;
        case 270:
            body = "270_profileedit_update_accepted";
            break;
        case 280:
            body = "280_eventranking_update_accepted";
            break;
        case 290:
            body = "290_report_accepted";
            break;

        case 401:
            body = "401_unauthorized";
            break;
        case 403:
            body = "403_forbidden";
            break;
        case 404:
            body = "404_not_found";
            break;
        case 405:
            body = "405_method_not_allowed";
            break;
        case 408:
            body = "408_request_timeout";
            break;
        case 410:
            body = "410_gone";
            break;
        case 430:
            body = "430_algo_rejected";
            break;
        case 431:
            body = "431_algo_no_users";
            break;
        case 440:
            body = "440_register_rejected";
            break;
        case 450:
            body = "450_post_publish_rejected";
            break;
        case 451:
            body = "451_post_publish_bad_words";
            break;
        case 452:
            body = "452_post_publish_bad_image";
            break;
        case 460:
            body = "460_event_publish_rejected";
            break;
        case 461:
            body = "461_event_publish_bad_words";
            break;
        case 462:
            body = "462_event_publish_bad_image";
            break;
        case 470:
            body = "470_profileedit_update_rejected";
            break;
        case 480:
            body = "480_eventranking_update_rejected";
            break;
        case 490:
            body = "490_report_rejected";
            break;
        case 491:
            body = "490_report_already_reported";
            break;

        case 500:
            body = "500_internal_server_error";
            break;
        case 502:
            body = "502_bad_gateway";
            break;

        default:
            body = "502_bad_gateway";
            break;
    }
    return body;
}
