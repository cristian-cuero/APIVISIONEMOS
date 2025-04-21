export const sql =
  "select    p.norecibo , p.fecha , p.fechanow ,  substring(p.detalle from 1 for 50) detalle, p.valor ValorDebito ,  iif((b.cuenta = '' or b.cuenta is null)  , pc.cuentapuente, b.cuenta) CuentaPuente , fo.fondo ,fo.nrocuenta , fo.tipo,  f.valor ValorCuenta, iif( b.cuenta <> ''  or b.cuenta is not null  , substring(pt.idpersona from 1 for char_length(pt.idpersona) -1), '811031526')  ClientePago ,  p.notificado ,";
sql =
  sql +
  " iif( f.idfondo = 5 , iif(substring(p.idcobrador from 1 for char_length(p.idcobrador) -1) = 1 , '811031526',substring(p.idcobrador from 1 for char_length(p.idcobrador) -1)),  substring(pt.idpersona from 1 for char_length(pt.idpersona) -1))  Cliente , s.idagencia,  p.usuario ";
sql =
  sql +
  " from tblpagos p inner join tblpagosdetallefondo f on p.norecibo = f.norecibo ";
sql =
  sql +
  " inner join tblfondos fo on f.idfondo = fo.idfondo inner join tblcontrato c on p.idcontrato = c.idcontrato  inner join tblzonas s on c.id = s.id ";
sql =
  sql +
  " inner join tblpersona pt on c.idpersona = pt.idpersona inner join tblparametoscontables pc on pc.id = 1 inner join tblpagosdetalle pgd on p.norecibo =  pgd.norecibo left  join tblbancos b on pgd.idbanco  = b.codigo where p.fecha >= ? and  p.SINCRONIZADOCONTABLE = 0 and p.anulado = 0   order by p.norecibo ";
