package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.Pago;

import java.util.List;

@Repository
public interface PagoRepository extends CrudRepository<Pago, Long> {
    List<Pago> findByEstado(String estado);
    List<Pago> findByMetodo(String metodo);
}