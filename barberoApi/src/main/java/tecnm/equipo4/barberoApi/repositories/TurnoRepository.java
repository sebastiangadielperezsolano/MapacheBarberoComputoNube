package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Turno;

import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByFecha(String fecha);
    List<Turno> findByEstado(String estado);
    List<Turno> findBySucursal_IdSucursal(Long idSucursal);
    List<Turno> findByBarbero_IdBarberoOrderByIdTurnoDesc(Long idBarbero);
    List<Turno> findByCliente_IdClienteOrderByIdTurnoDesc(Long idCliente);
    List<Turno> findByBarbero_IdBarberoAndFechaAndEstadoNot(Long idBarbero, String fecha, String estado);
}