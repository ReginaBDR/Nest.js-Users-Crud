import { Request } from 'express';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

interface AuthenticatedRequest extends Request {
  usuario: Usuario;
}

export default AuthenticatedRequest;
