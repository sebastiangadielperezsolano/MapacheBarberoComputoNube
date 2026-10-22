package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Turno;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    @Query(value = "SELECT * FROM turno WHERE id_cliente = :idCliente ORDER BY fecha DESC, hora_inicio DESC", nativeQuery = true)
    List<Turno> buscarPorCliente(@Param("idCliente") Long idCliente);

    List<Turno> findByFecha(LocalDate fecha);

    List<Turno> findByEstado(String estado);
}