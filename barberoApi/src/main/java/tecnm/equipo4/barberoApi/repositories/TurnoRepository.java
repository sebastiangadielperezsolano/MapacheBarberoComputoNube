package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Turno;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {
    // Busca turnos por barbero y fecha (ajusta si el id en Barbero se llama distinto)
    List<Turno> findByBarberoIdBarberoAndFecha(Long idBarbero, LocalDate fecha);
    List<Turno> findByClienteIdCliente(Long idCliente);
}
