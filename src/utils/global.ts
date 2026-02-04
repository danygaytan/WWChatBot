import { Asset } from "./types";

export const error_no_command_text = 'No escribiste ningun comando';
export const error_forbidden_caller = 'No tienes permiso de usarme';
export const error_no_command_found = 'No existe el comando escrito o no tienes permiso de usarlo aqui.';
export const error_openai_api_response = 'Hubo un error procesando el query';
export const error_no_query_in_body = 'Tienes que escribir un query';
export const error_general_failure = 'Algo pasó y no se ejecutó el comando :(';
export const error_track_command_general_failure = 'Hubo un error al generar el rastreo del producto';
export const error_track_command_unable_to_verify_url = 'La URL escrita no es valida';
export const error_fetching_asset = 'No he podido obtener la ultima informacion del producto.';
export const error_createAsset_general_failure = 'No he podido registrar el producto solicitado.';
export const error_user_not_found = 'El usuario no existe.';


export const warning_command_work_in_progress = 'Comando en construcción';


export const success_track_command_general_response = (asset: Asset) => {
    return `
Tu producto esta siendo rastreado 👀
    
*${asset.name}*

Precio actual: *$${asset.price}*
`;
}

export const success_track_cron_job_general_response = (asset: Asset) => {
    return `
Tu producto cambio de precio 🤔

*${asset.name}*

Precio actualizado: *$${asset.price}*
Precio anterior: ~$${asset.previous_price}~

Link: _${asset.url_string}_
`;

}